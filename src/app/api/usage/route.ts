import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  checkUsageLimit,
  parseCookie,
  serializeCookie,
  COOKIE_NAME,
  COOKIE_OPTIONS,
} from "@/lib/usage-limit";

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const cookieValue = request.cookies.get(COOKIE_NAME)?.value;

  const result = checkUsageLimit(ip, cookieValue);

  const response = NextResponse.json({
    remaining: result.remaining,
    total: 3,
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
