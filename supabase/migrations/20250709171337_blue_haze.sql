/*
  # Update kenig_rates table structure
  
  This migration adds a 'rate' column to the kenig_rates table and updates existing records
  to set the rate value equal to the sell value for backward compatibility.
  
  1. Schema Changes
    - Add 'rate' column to kenig_rates table if it doesn't exist
    - Update existing records to set rate = sell
    
  2. Data Verification
    - Verify the column was added successfully
    - Count records that have been updated
*/

-- Add rate column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'kenig_rates' AND column_name = 'rate'
  ) THEN
    ALTER TABLE kenig_rates ADD COLUMN rate numeric NULL;
    
    -- Update existing records to set rate = sell for compatibility
    UPDATE kenig_rates SET rate = sell WHERE rate IS NULL;
    
    RAISE NOTICE 'Added rate column to kenig_rates table';
  ELSE
    RAISE NOTICE 'rate column already exists in kenig_rates table';
  END IF;
END $$;

-- Verify the column was added successfully
SELECT 
  'rate column added to kenig_rates table' as status,
  COUNT(*) as records_updated
FROM kenig_rates
WHERE rate IS NOT NULL;

-- Update all records to ensure rate is set
UPDATE kenig_rates SET rate = sell WHERE rate IS NULL;

-- Show sample data with the new rate column
SELECT 
  source,
  base,
  quote,
  sell,
  buy,
  rate,
  updated_at
FROM kenig_rates 
WHERE source = 'kenig'
ORDER BY base, quote
LIMIT 10;