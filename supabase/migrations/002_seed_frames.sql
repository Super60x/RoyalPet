-- RoyalPet.app — Seed data: 6 kaderopties
-- Run dit NA 001_create_tables.sql

INSERT INTO frames (id, name, price_cents, overlay_url, active) VALUES
  ('geen',             'Geen kader',        0,    NULL, true),
  ('zwart_modern',     'Zwart Modern',      2500, '/frames/zwart_modern.png', true),
  ('wit_modern',       'Wit Modern',        2500, '/frames/wit_modern.png', true),
  ('klassiek_goud',    'Klassiek Goud',     3500, '/frames/klassiek_goud.png', true),
  ('klassiek_walnoot', 'Klassiek Walnoot',  3500, '/frames/klassiek_walnoot.png', true),
  ('antiek_zilver',    'Antiek Zilver',     3000, '/frames/antiek_zilver.png', true)
ON CONFLICT (id) DO NOTHING;
