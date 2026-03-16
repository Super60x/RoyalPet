import { createAdminClient } from "@/lib/supabase/admin";

const CREDIT_EMAIL_COOKIE = "rp_credit_email";

export { CREDIT_EMAIL_COOKIE };

/**
 * Get total remaining credits for an email address.
 */
export async function getCredits(email: string): Promise<number> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("generation_credits")
    .select("credits_remaining")
    .eq("email", email.toLowerCase())
    .gt("credits_remaining", 0)
    .gt("expires_at", new Date().toISOString());

  if (error || !data) return 0;
  return data.reduce((sum, row) => sum + row.credits_remaining, 0);
}

/**
 * Deduct 1 credit from the oldest pack (FIFO).
 * Returns true if successful, false if no credits available.
 */
export async function deductCredit(email: string): Promise<boolean> {
  const supabase = createAdminClient();

  // Find oldest row with remaining credits
  const { data, error } = await supabase
    .from("generation_credits")
    .select("id, credits_remaining")
    .eq("email", email.toLowerCase())
    .gt("credits_remaining", 0)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (error || !data) return false;

  // Decrement
  const { error: updateError } = await supabase
    .from("generation_credits")
    .update({ credits_remaining: data.credits_remaining - 1 })
    .eq("id", data.id);

  return !updateError;
}

/**
 * Add credits for an email (after Stripe payment).
 */
export async function addCredits(params: {
  email: string;
  creditsPurchased: number;
  packId: string;
  stripeSessionId: string;
}): Promise<void> {
  const supabase = createAdminClient();
  const id = `gc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  await supabase.from("generation_credits").insert({
    id,
    email: params.email.toLowerCase(),
    credits_purchased: params.creditsPurchased,
    credits_remaining: params.creditsPurchased,
    stripe_session_id: params.stripeSessionId,
    pack_id: params.packId,
  });
}
