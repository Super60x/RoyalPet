-- RoyalPet.app — Storage Buckets
-- Run dit in Supabase SQL Editor

-- Maak de 3 storage buckets aan
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('portraits-public',  'portraits-public',  true),
  ('portraits-private', 'portraits-private', false),
  ('frames',            'frames',            true)
ON CONFLICT (id) DO NOTHING;

-- portraits-public: iedereen kan lezen (watermarked previews)
CREATE POLICY "Public read portraits-public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portraits-public');

-- portraits-private: alleen via service role (signed URLs na betaling)
-- Geen publieke policy nodig — admin client gebruikt service role key

-- frames: iedereen kan lezen (kader overlays)
CREATE POLICY "Public read frames"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'frames');
