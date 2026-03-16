import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  checkUsageLimit,
  parseCookie,
  serializeCookie,
  COOKIE_NAME,
  COOKIE_OPTIONS,
} from "@/lib/usage-limit";
import { getCredits, CREDIT_EMAIL_COOKIE } from "@/lib/credits";

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const cookieValue = request.cookies.get(COOKIE_NAME)?.value;

  const result = checkUsageLimit(ip, cookieValue);

  // Check for purchased credits
  const creditEmail = request.cookies.get(CREDIT_EMAIL_COOKIE)?.value;
  let credits = 0;
  if (creditEmail) {
    credits = await getCredits(creditEmail);
  }

  const response = NextResponse.json({
    remaining: result.remaining,
    total: 1,
    credits,
    creditEmail: creditEmail || null,
  });

  // If new visitor, set an initial cookie (count=0) so we can track them
  if (result.isNewVisitor && !parseCookie(cookieValue)) {
    const initialCookie = {
      visitorId: crypto.randomBytes(4).toString("hex"),
      count: 0,
      createdAt: Date.now(),
    };
    response.cookies.set(COOKIE_NAME, serializeCookie(initialCookie), COOKIE_OPTIONS);
  }

  return response;
}
