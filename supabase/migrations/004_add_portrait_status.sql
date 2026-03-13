-- RoyalPet.app — Add status + prediction_id to portraits
-- Run dit in Supabase SQL Editor NA de eerdere migraties

ALTER TABLE portraits ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';
ALTER TABLE portraits ADD COLUMN IF NOT EXISTS prediction_id text;

-- Status waarden: 'pending' | 'processing' | 'completed' | 'failed'
