/*
  # Add rate field to kenig_rates table
  
  This migration adds a new 'rate' field to the kenig_rates table
  to simplify exchange rate calculations and make the API more consistent.
  
  1. Schema Changes
    - Add 'rate' column to kenig_rates table
    - Update existing records to set rate = sell for compatibility
    
  2. Data Verification
    - Verify the column was added successfully
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