import { NextRequest, NextResponse } from "next/server";
import { getCredits, CREDIT_EMAIL_COOKIE } from "@/lib/credits";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Ongeldig e-mailadres." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();
    const credits = await getCredits(normalizedEmail);

    const response = NextResponse.json({
      credits,
      email: normalizedEmail,
    });

    // Set credit email cookie so generate route can find it
    if (credits > 0) {
      response.cookies.set(CREDIT_EMAIL_COOKIE, normalizedEmail, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 365 * 24 * 60 * 60, // 1 year
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Credit check error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis." },
      { status: 500 }
    );
  }
}
