-- Prevent duplicate orders from Stripe webhook race conditions
-- Stripe CLI (and sometimes production) sends the webhook twice nearly simultaneously
CREATE UNIQUE INDEX IF NOT EXISTS orders_stripe_session_id_unique
  ON orders (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;
