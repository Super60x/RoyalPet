import crypto from "crypto";

const MAX_FREE_UPLOADS = 3;
const WINDOW_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

interface UsageCookie {
  visitorId: string;
  count: number;
  createdAt: number;
}

interface UsageLimitResult {
  allowed: boolean;
  remaining: number;
  count: number;
  isNewVisitor: boolean;
}

// In-memory IP usage store (resets on deploy — acceptable for MVP)
const ipUsageStore = new Map<string, { count: number; expiresAt: number }>();

function getSecret(): string {
  const secret = process.env.USAGE_COOKIE_SECRET;
  if (!secret) {
    throw new Error("USAGE_COOKIE_SECRET environment variable is required");
  }
  return secret;
}

function signPayload(payload: string): string {
  const hmac = crypto.createHmac("sha256", getSecret());
  hmac.update(payload);
  return `${payload}.${hmac.digest("hex")}`;
}

function verifyAndExtractPayload(signed: string): string | null {
  const lastDot = signed.lastIndexOf(".");
  if (lastDot === -1) return null;

  const payload = signed.substring(0, lastDot);
  const signature = signed.substring(lastDot + 1);

  const hmac = crypto.createHmac("sha256", getSecret());
  hmac.update(payload);
  const expected = hmac.digest("hex");

  // Timing-safe comparison
  if (signature.length !== expected.length) return null;
  const sigBuffer = Buffer.from(signature, "hex");
  const expBuffer = Buffer.from(expected, "hex");
  if (sigBuffer.length !== expBuffer.length) return null;

  if (crypto.timingSafeEqual(sigBuffer, expBuffer)) {
    return payload;
  }
  return null;
}

export function parseCookie(cookieValue: string | undefined): UsageCookie | null {
  if (!cookieValue) return null;

  const payload = verifyAndExtractPayload(cookieValue);
  if (!payload) return null;

  const parts = payload.split(":");
  if (parts.length !== 3) return null;

  const visitorId = parts[0];
  const count = parseInt(parts[1], 10);
  const createdAt = parseInt(parts[2], 10);

  if (!visitorId || isNaN(count) || isNaN(createdAt)) return null;

  // Check if cookie has expired (30 days)
  if (Date.now() - createdAt > WINDOW_MS) return null;

  return { visitorId, count, createdAt };
}

export function serializeCookie(cookie: UsageCookie): string {
  const payload = `${cookie.visitorId}:${cookie.count}:${cookie.createdAt}`;
  return signPayload(payload);
}

function generateVisitorId(): string {
  return crypto.randomBytes(4).toString("hex"); // 8 chars
}

function getIpUsage(ip: string): number {
  const entry = ipUsageStore.get(ip);
  if (!entry) return 0;
  if (Date.now() > entry.expiresAt) {
    ipUsageStore.delete(ip);
    return 0;
  }
  return entry.count;
}

function incrementIpUsage(ip: string): void {
  const entry = ipUsageStore.get(ip);
  if (entry && Date.now() <= entry.expiresAt) {
    entry.count++;
  } else {
    ipUsageStore.set(ip, { count: 1, expiresAt: Date.now() + WINDOW_MS });
  }
}

export function checkUsageLimit(
  ip: string,
  cookieValue: string | undefined
): UsageLimitResult {
  const cookie = parseCookie(cookieValue);
  const ipCount = getIpUsage(ip);
  const isNewVisitor = !cookie && !cookieValue;

  let effectiveCount: number;

  if (cookie) {
    // Valid signed cookie — most trustworthy signal
    effectiveCount = cookie.count;
  } else if (isNewVisitor && ipCount >= MAX_FREE_UPLOADS) {
    // No cookie at all + IP maxed out = benefit of the doubt (shared IP)
    // Allow this person to start fresh with their own cookie
    effectiveCount = 0;
  } else if (ipCount > 0) {
    // No valid cookie but IP has usage — fallback (cookie-clearer)
    effectiveCount = ipCount;
  } else {
    // Completely new visitor
    effectiveCount = 0;
  }

  return {
    allowed: effectiveCount < MAX_FREE_UPLOADS,
    remaining: Math.max(0, MAX_FREE_UPLOADS - effectiveCount),
    count: effectiveCount,
    isNewVisitor,
  };
}

export function incrementUsage(
  ip: string,
  cookie: UsageCookie | null
): { newCookieValue: string; newCookie: UsageCookie } {
  // Always increment IP count
  incrementIpUsage(ip);

  // Create or update cookie
  const newCookie: UsageCookie = cookie
    ? { ...cookie, count: cookie.count + 1 }
    : { visitorId: generateVisitorId(), count: 1, createdAt: Date.now() };

  return {
    newCookieValue: serializeCookie(newCookie),
    newCookie,
  };
}

export const COOKIE_NAME = "rp_usage";
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
};
