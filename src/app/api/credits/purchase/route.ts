import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { getPack } from "@/config/credit-packs";
import { formatPrice } from "@/config/products";

export async function POST(request: NextRequest) {
  try {
    const { packId, email } = await request.json();

    if (!packId || !email) {
      return NextResponse.json(
        { error: "Ontbrekende velden." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Ongeldig e-mailadres." },
        { status: 400 }
      );
    }

    const pack = getPack(packId);
    if (!pack) {
      return NextResponse.json(
        { error: "Ongeldig pakket." },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      customer_email: email.toLowerCase(),
      payment_method_types: ["ideal", "bancontact", "card"],
      locale: "nl",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `RoyalPet Credit Pack — ${pack.label}`,
              description: `${pack.credits} AI portret generaties (${pack.perGenLabel})`,
            },
            unit_amount: pack.priceCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "credit_pack",
        pack_id: pack.id,
        email: email.toLowerCase(),
        credits: String(pack.credits),
      },
      success_url: `${baseUrl}/?credits=success&email=${encodeURIComponent(email.toLowerCase())}`,
      cancel_url: `${baseUrl}/`,
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Credit purchase error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis bij het aanmaken van de betaling." },
      { status: 500 }
    );
  }
}
