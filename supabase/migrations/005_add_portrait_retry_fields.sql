-- RoyalPet.app — Add retry fields to portraits
-- Run dit in Supabase SQL Editor NA migratie 004

ALTER TABLE portraits ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE portraits ADD COLUMN IF NOT EXISTS custom_edit text;

-- gender: 'masculine' | 'feminine' | NULL
-- custom_edit: user's free text edit description (max 200 chars enforced in app)
