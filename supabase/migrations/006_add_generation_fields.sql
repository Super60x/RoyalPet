-- Migration 006: Add pose and model tracking to portraits
-- Supports: standing/laying pose selection + multi-model generation

ALTER TABLE portraits ADD COLUMN IF NOT EXISTS pose text DEFAULT 'laying_down';
ALTER TABLE portraits ADD COLUMN IF NOT EXISTS model_used text;
