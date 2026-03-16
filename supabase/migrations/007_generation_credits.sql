-- Migration 007: Generation credits (email-based, no auth)
-- Credits allow users to generate additional portraits beyond the 1 free generation.

CREATE TABLE IF NOT EXISTS generation_credits (
  id                text PRIMARY KEY,
  email             text NOT NULL,
  credits_purchased integer NOT NULL,
  credits_remaining integer NOT NULL,
  stripe_session_id text,
  pack_id           text NOT NULL,
  created_at        timestamptz DEFAULT now(),
  expires_at        timestamptz DEFAULT (now() + interval '365 days')
);

CREATE INDEX idx_credits_email ON generation_credits(email);
CREATE INDEX idx_credits_email_remaining ON generation_credits(email, credits_remaining)
  WHERE credits_remaining > 0;

-- RLS: service role only
ALTER TABLE generation_credits ENABLE ROW LEVEL SECURITY;
