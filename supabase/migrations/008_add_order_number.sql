-- Add sequential order number for human-readable order references
-- Display format: RP-00001, RP-00002, etc.
-- The text `id` column remains as internal identifier

ALTER TABLE orders ADD COLUMN order_number SERIAL;

-- Create index for fast lookups by order_number
CREATE INDEX idx_orders_order_number ON orders(order_number);
