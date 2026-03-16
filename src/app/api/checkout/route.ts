import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { PRODUCTS } from "@/config/products";

// Build a flat lookup: sizeId -> { type, label, priceCents }
const SIZE_LOOKUP = new Map(
  PRODUCTS.flatMap((cat) =>
    cat.sizes.map((s) => [
      s.id,
      { type: cat.type, typeName: cat.name, label: s.label, priceCents: s.priceCents },
    ])
  )
);

export async function POST(request: NextRequest) {
  try {
    const { portraitId, productId, frameId, email } = await request.json();

    // Validate required fields
    if (!portraitId || !productId || !email) {
      return NextResponse.json(
        { error: "Ontbrekende velden." },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Ongeldig e-mailadres." },
        { status: 400 }
      );
    }

    // Validate product
    const product = SIZE_LOOKUP.get(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Ongeldig product." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Verify portrait exists
    const { data: portrait, error: portraitError } = await supabase
      .from("portraits")
      .select("id, image_url")
      .eq("id", portraitId)
      .single();

    if (portraitError || !portrait) {
      return NextResponse.json(
        { error: "Portret niet gevonden." },
        { status: 404 }
      );
    }

    // Get frame price if selected
    let framePriceCents = 0;
    let frameName = "Geen kader";
    if (frameId && frameId !== "geen") {
      const { data: frame } = await supabase
        .from("frames")
        .select("name, price_cents")
        .eq("id", frameId)
        .eq("active", true)
        .single();

      if (frame) {
        framePriceCents = frame.price_cents;
        frameName = frame.name;
      }
    }

    const totalCents = product.priceCents + framePriceCents;

    // Save customer email on portrait
    await supabase
      .from("portraits")
      .update({ customer_email: email })
      .eq("id", portraitId);

    // Determine if shipping is needed
    const isDigital = product.type === "digital";

    // Build Stripe line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `Renaissance Portret — ${product.typeName}`,
            description: product.label ? `Maat: ${product.label}` : "High-res digitaal bestand",
          },
          unit_amount: product.priceCents,
        },
        quantity: 1,
      },
    ];

    if (framePriceCents > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: `Kader — ${frameName}`,
          },
          unit_amount: framePriceCents,
        },
        quantity: 1,
      });
    }

    // Build Stripe Checkout session
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      customer_email: email,
      payment_method_types: ["ideal", "bancontact", "card"],
      locale: "nl",
      line_items: lineItems,
      success_url: `${baseUrl}/success/${portraitId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/preview/${portraitId}`,
      metadata: {
        portrait_id: portraitId,
        product_id: productId,
        product_type: product.type,
        frame_id: frameId || "geen",
        total_cents: String(totalCents),
      },
    };

    // Add shipping collection for physical products
    if (!isDigital) {
      sessionConfig.shipping_address_collection = {
        allowed_countries: ["NL", "BE", "DE"],
      };
      sessionConfig.phone_number_collection = { enabled: true };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    // Save abandoned checkout for recovery emails
    const abandonedId = `ab_${portraitId}_${Date.now()}`;
    await supabase.from("abandoned_checkouts").insert({
      id: abandonedId,
      email,
      portrait_id: portraitId,
      portrait_url: portrait.image_url,
      checkout_url: session.url,
      product: productId,
      price_cents: totalCents,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis bij het aanmaken van de betaling." },
      { status: 500 }
    );
  }
}
