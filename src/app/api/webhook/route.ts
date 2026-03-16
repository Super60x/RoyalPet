import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { addCredits } from "@/lib/credits";
import Stripe from "stripe";

// Disable body parsing — Stripe needs the raw body for signature verification
export const runtime = "nodejs";

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

    // Route based on checkout type
    if (metadata.type === "credit_pack") {
      await handleCreditPackPurchase(session);
    } else {
      await handleProductPurchase(session);
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

  // 2. Get frame price
  let framePriceCents = 0;
  if (frameId && frameId !== "geen") {
    const { data: frame } = await supabase
      .from("frames")
      .select("price_cents")
      .eq("id", frameId)
      .single();
    if (frame) framePriceCents = frame.price_cents;
  }

  // 3. Extract shipping address from Stripe session
  // eslint-disable-next-line
  const shippingDetails = (session as unknown as { shipping_details?: { name?: string; address?: { line1?: string; line2?: string; city?: string; postal_code?: string; country?: string } } }).shipping_details || null;
  const shippingAddress = shippingDetails
    ? {
        name: shippingDetails.name,
        line1: shippingDetails.address?.line1,
        line2: shippingDetails.address?.line2,
        city: shippingDetails.address?.city,
        postal_code: shippingDetails.address?.postal_code,
        country: shippingDetails.address?.country,
      }
    : null;

  // 4. Create order
  const orderId = `ord_${portraitId}_${Date.now()}`;
  const { error: orderError } = await supabase.from("orders").insert({
    id: orderId,
    portrait_id: portraitId,
    product: productId,
    price_cents: totalCents - framePriceCents,
    frame_id: frameId !== "geen" ? frameId : null,
    frame_price_cents: framePriceCents > 0 ? framePriceCents : null,
    customer_email: session.customer_email || session.customer_details?.email || "",
    shipping_address: shippingAddress,
    stripe_session_id: session.id,
    status: productType === "digital" ? "geleverd" : "pending",
    fulfilled: productType === "digital",
  });

  if (orderError) {
    console.error("Webhook: order insert error:", orderError);
  }

  // 5. Mark abandoned checkouts as recovered
  await supabase
    .from("abandoned_checkouts")
    .update({ recovered: true })
    .eq("portrait_id", portraitId)
    .eq("email", session.customer_email || session.customer_details?.email || "");

  // TODO Sessie 5+: Send Resend emails (owner notification for print, customer confirmation)
  console.log(`Order ${orderId} created for portrait ${portraitId} (${productType})`);
}
