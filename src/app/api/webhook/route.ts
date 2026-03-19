import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { addCredits } from "@/lib/credits";
import { sendOwnerNotification, sendCustomerConfirmation } from "@/lib/email";
import Stripe from "stripe";

// Disable body parsing — Stripe needs the raw body for signature verification
export const runtime = "nodejs";

// In-memory lock to prevent race conditions when Stripe sends duplicate webhooks
const processingSessionIds = new Set<string>();

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};

    // Prevent duplicate processing from simultaneous webhook deliveries
    if (processingSessionIds.has(session.id)) {
      console.log(`Webhook: session ${session.id} already being processed, skipping`);
      return NextResponse.json({ received: true });
    }
    processingSessionIds.add(session.id);

    try {
      if (metadata.type === "credit_pack") {
        await handleCreditPackPurchase(session);
      } else {
        await handleProductPurchase(session);
      }
    } finally {
      // Clean up after 60s to prevent memory leak
      setTimeout(() => processingSessionIds.delete(session.id), 60000);
    }
  }

  return NextResponse.json({ received: true });
}

// --- Credit pack purchase ---
async function handleCreditPackPurchase(session: Stripe.Checkout.Session) {
  const metadata = session.metadata || {};
  const email = metadata.email;
  const packId = metadata.pack_id;
  const credits = parseInt(metadata.credits || "0", 10);

  if (!email || !packId || !credits) {
    console.error("Webhook: missing credit pack metadata", metadata);
    return;
  }

  // Idempotency: skip if credits already added for this Stripe session
  const supabase = createAdminClient();
  const { data: existing } = await supabase
    .from("generation_credits")
    .select("id")
    .eq("stripe_session_id", session.id)
    .limit(1)
    .single();

  if (existing) {
    console.log(`Webhook: credits already added for session ${session.id}, skipping`);
    return;
  }

  await addCredits({
    email,
    creditsPurchased: credits,
    packId,
    stripeSessionId: session.id,
  });

  console.log(`Credit pack ${packId} (${credits} credits) added for ${email}`);
}

// --- Product purchase (existing flow) ---
async function handleProductPurchase(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient();
  const metadata = session.metadata || {};

  const portraitId = metadata.portrait_id;
  const productId = metadata.product_id;
  const productType = metadata.product_type;
  const frameId = metadata.frame_id;
  const totalCents = parseInt(metadata.total_cents || "0", 10);

  if (!portraitId) {
    console.error("Webhook: missing portrait_id in metadata");
    return;
  }

  // Idempotency: skip if order already exists for this Stripe session
  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_session_id", session.id)
    .limit(1)
    .single();

  if (existingOrder) {
    console.log(`Webhook: order already exists for session ${session.id}, skipping`);
    return;
  }

  // 1. Mark portrait as paid
  await supabase
    .from("portraits")
    .update({ paid: true })
    .eq("id", portraitId);

  // 2. Get frame price + name
  let framePriceCents = 0;
  let frameName: string | null = null;
  if (frameId && frameId !== "geen") {
    const { data: frame } = await supabase
      .from("frames")
      .select("price_cents, name")
      .eq("id", frameId)
      .single();
    if (frame) {
      framePriceCents = frame.price_cents;
      frameName = frame.name;
    }
  }

  // 3. Extract shipping address + phone from Stripe session
  // Stripe API 2026+: shipping is under collected_information.shipping_details
  // Older versions: shipping is under session.shipping_details (top-level)
  const customerDetails = session.customer_details;
  const customerPhone = customerDetails?.phone || null;

  // Try new API path first (collected_information.shipping_details)
  const collectedShipping = session.collected_information?.shipping_details || null;

  const shippingAddress = collectedShipping
    ? {
        name: collectedShipping.name || customerDetails?.name || undefined,
        line1: collectedShipping.address?.line1 || undefined,
        line2: collectedShipping.address?.line2 || undefined,
        city: collectedShipping.address?.city || undefined,
        postal_code: collectedShipping.address?.postal_code || undefined,
        country: collectedShipping.address?.country || undefined,
        phone: customerPhone,
      }
    : null;

  // Debug log to trace shipping extraction
  console.log("Stripe collected_information:", JSON.stringify(session.collected_information));
  console.log("Stripe customer_details:", JSON.stringify(customerDetails));
  console.log("Extracted shippingAddress:", JSON.stringify(shippingAddress));

  // 4. Create order (order_number is auto-generated by SERIAL column)
  // Use stripe session ID as part of order ID to prevent race condition duplicates
  const orderId = `ord_${portraitId}_${Date.now()}`;
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      id: orderId,
      portrait_id: portraitId,
      product: productId,
      price_cents: totalCents - framePriceCents,
      frame_id: frameId !== "geen" ? frameId : null,
      frame_price_cents: framePriceCents > 0 ? framePriceCents : null,
      customer_email:
        session.customer_email || session.customer_details?.email || "",
      shipping_address: shippingAddress,
      stripe_session_id: session.id,
      status: productType === "digital" ? "geleverd" : "pending",
      fulfilled: productType === "digital",
    })
    .select("order_number")
    .single();

  if (orderError) {
    // If insert failed due to duplicate stripe_session_id (race condition),
    // another webhook call already handled this — skip silently
    if (orderError.code === "23505" || orderError.message?.includes("duplicate")) {
      console.log(`Webhook: duplicate insert blocked for session ${session.id}, skipping`);
      return;
    }
    console.error("Webhook: order insert error:", orderError);
    return;
  }

  // Human-readable order number: RP-00001
  const orderNumber = orderData?.order_number
    ? `RP-${String(orderData.order_number).padStart(5, "0")}`
    : orderId;

  // 5. Mark abandoned checkouts as recovered
  await supabase
    .from("abandoned_checkouts")
    .update({ recovered: true })
    .eq("portrait_id", portraitId)
    .eq("email", session.customer_email || session.customer_details?.email || "");

  // 6. Send email notifications
  console.log(`Order ${orderId} created for portrait ${portraitId} (${productType})`);
  try {
    // Generate signed URL for clean image (used as email thumbnail — customer paid, no watermark)
    const { data: ownerSigned } = await supabase.storage
      .from("portraits-private")
      .createSignedUrl(`${portraitId}.png`, 31536000); // 1 year — owner download

    // Clean image thumbnail for emails (1 year expiry, just for display)
    const { data: emailThumbnail } = await supabase.storage
      .from("portraits-private")
      .createSignedUrl(`${portraitId}.png`, 31536000); // 1 year

    const customerEmail =
      session.customer_email || session.customer_details?.email || "";
    const orderDate = new Date();

    const emailParams = {
      orderId: orderNumber,
      portraitId,
      product: productId,
      productType: productType || "digital",
      priceCents: totalCents - framePriceCents,
      frameId: frameId !== "geen" ? frameId : null,
      frameName,
      framePriceCents,
      totalCents,
      customerEmail,
      customerName: shippingAddress?.name || customerDetails?.name || null,
      customerPhone,
      shippingAddress,
      portraitImageUrl: emailThumbnail?.signedUrl || "",
      cleanDownloadUrl: ownerSigned?.signedUrl || "",
      orderDate,
    };

    // Customer confirmation email
    await sendCustomerConfirmation(emailParams);

    // Owner notification for ALL orders
    await sendOwnerNotification(emailParams);
  } catch (emailError) {
    console.error("Email sending failed (non-fatal):", emailError);
  }
}
