/*
  # Add from_currency and to_currency columns to kenig_rates

  This migration adds new columns to support the Exnode XML format
  that uses from_currency and to_currency instead of base and quote.

  1. Changes
    - Add `from_currency` column (text) - currency sending from (Exnode format)
    - Add `to_currency` column (text) - currency sending to (Exnode format)
    - Add `minamount` column (numeric) - alias for min_amount
    - Add `maxamount` column (numeric) - alias for max_amount
    - Populate new columns from existing base/quote data

  2. Data Migration
    - Copy base -> from_currency
    - Copy quote -> to_currency
    - Copy min_amount -> minamount
    - Copy max_amount -> maxamount
*/

-- Add new columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'kenig_rates' AND column_name = 'from_currency'
  ) THEN
    ALTER TABLE kenig_rates ADD COLUMN from_currency text NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'kenig_rates' AND column_name = 'to_currency'
  ) THEN
    ALTER TABLE kenig_rates ADD COLUMN to_currency text NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'kenig_rates' AND column_name = 'minamount'
  ) THEN
    ALTER TABLE kenig_rates ADD COLUMN minamount numeric NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'kenig_rates' AND column_name = 'maxamount'
  ) THEN
    ALTER TABLE kenig_rates ADD COLUMN maxamount numeric NULL;
  END IF;
END $$;

-- Populate from_currency and to_currency from existing base/quote data
UPDATE kenig_rates 
SET 
  from_currency = base,
  to_currency = quote,
  minamount = COALESCE(min_amount, 100),
  maxamount = COALESCE(max_amount, 1000000)
WHERE from_currency IS NULL OR to_currency IS NULL;

-- Create index for new columns
CREATE INDEX IF NOT EXISTS idx_kenig_rates_from_to_currency 
  ON kenig_rates(from_currency, to_currency);

-- Verify the migration
SELECT 
  'Migration completed successfully' as status,
  COUNT(*) as total_records,
  COUNT(from_currency) as with_from_currency,
  COUNT(to_currency) as with_to_currency
FROM kenig_rates;