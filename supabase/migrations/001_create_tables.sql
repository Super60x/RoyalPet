-- RoyalPet.app — Database Schema
-- Run dit in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- ============================================
-- 1. FRAMES tabel (moet eerst, want orders referenceert deze)
-- ============================================
CREATE TABLE IF NOT EXISTS frames (
  id          text PRIMARY KEY,
  name        text NOT NULL,
  price_cents integer NOT NULL,
  overlay_url text,
  active      boolean DEFAULT true
);

-- ============================================
-- 2. PORTRAITS tabel
-- ============================================
CREATE TABLE IF NOT EXISTS portraits (
  id              text PRIMARY KEY,           -- 6-karakter random slug
  user_id         uuid REFERENCES auth.users(id),  -- NULL voor gastgebruikers
  image_url       text,                       -- watermarked versie (portraits-public)
  clean_url       text,                       -- origineel zonder watermark (portraits-private)
  style           text,                       -- Renaissance stijlnaam
  pet_name        text,
  customer_email  text,                       -- voor marketing/re-engagement
  paid            boolean DEFAULT false,
  retry_count     integer DEFAULT 0,          -- 1 gratis, daarna betaald
  share_count     integer DEFAULT 0,
  created_at      timestamptz DEFAULT now()
);

-- ============================================
-- 3. ORDERS tabel
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id                text PRIMARY KEY,
  portrait_id       text REFERENCES portraits(id),
  user_id           uuid REFERENCES auth.users(id),
  product           text NOT NULL,            -- 'digital' | 'fine_art' | 'canvas'
  price_cents       integer NOT NULL,
  frame_id          text REFERENCES frames(id),
  frame_price_cents integer,
  is_gift           boolean DEFAULT false,
  gift_message      text,
  shipping_address  jsonb,                    -- Stripe levert dit aan
  customer_email    text NOT NULL,
  stripe_session_id text,
  status            text DEFAULT 'pending',   -- 'pending'|'in_productie'|'verzonden'|'geleverd'
  fulfilled         boolean DEFAULT false,
  created_at        timestamptz DEFAULT now()
);

-- ============================================
-- 4. ABANDONED_CHECKOUTS tabel
-- ============================================
CREATE TABLE IF NOT EXISTS abandoned_checkouts (
  id               text PRIMARY KEY,
  email            text NOT NULL,
  portrait_id      text REFERENCES portraits(id),
  portrait_url     text,                      -- watermarked URL voor email preview
  checkout_url     text,                      -- Stripe checkout URL
  product          text,
  price_cents      integer,
  recovery_sent_at timestamptz,
  recovered        boolean DEFAULT false,
  created_at       timestamptz DEFAULT now()
);

-- ============================================
-- 5. ROW LEVEL SECURITY (basis)
-- ============================================
ALTER TABLE portraits ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE frames ENABLE ROW LEVEL SECURITY;
ALTER TABLE abandoned_checkouts ENABLE ROW LEVEL SECURITY;

-- Frames zijn publiek leesbaar (iedereen moet kaders kunnen zien)
CREATE POLICY "Frames are publicly readable"
  ON frames FOR SELECT
  USING (true);

-- Portraits: service role heeft volledige toegang via admin client
-- Gebruikers kunnen hun eigen portretten lezen
CREATE POLICY "Users can read own portraits"
  ON portraits FOR SELECT
  USING (auth.uid() = user_id);

-- Publieke portretten (voor share pagina) — iedereen kan lezen
CREATE POLICY "Public portraits are readable"
  ON portraits FOR SELECT
  USING (paid = true);

-- Orders: gebruikers lezen eigen orders
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);
