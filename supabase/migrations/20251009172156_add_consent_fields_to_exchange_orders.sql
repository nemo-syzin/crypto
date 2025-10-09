/*
  # Add Consent Fields to Exchange Orders Table

  1. Changes
    - Add `accepted_aml_kyc` boolean column to track AML/CTF and KYC policy consent
    - Add `accepted_terms` boolean column to track terms of service consent
    - Add `accepted_at` timestamp column to record when consent was given
    - Set default values to false for consent fields for data integrity

  2. Purpose
    - Enable compliance tracking for user consent to policies
    - Support legal requirements for terms acceptance
    - Maintain audit trail of when users accepted policies

  3. Notes
    - Existing records will have NULL values for accepted_at (consent tracking wasn't implemented before)
    - New orders will require both consents to be accepted
    - Consent timestamps are important for regulatory compliance
*/

-- Add consent tracking columns to exchange_orders table
DO $$
BEGIN
  -- Add accepted_aml_kyc column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exchange_orders' AND column_name = 'accepted_aml_kyc'
  ) THEN
    ALTER TABLE exchange_orders ADD COLUMN accepted_aml_kyc BOOLEAN DEFAULT false;
  END IF;

  -- Add accepted_terms column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exchange_orders' AND column_name = 'accepted_terms'
  ) THEN
    ALTER TABLE exchange_orders ADD COLUMN accepted_terms BOOLEAN DEFAULT false;
  END IF;

  -- Add accepted_at timestamp column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exchange_orders' AND column_name = 'accepted_at'
  ) THEN
    ALTER TABLE exchange_orders ADD COLUMN accepted_at TIMESTAMPTZ;
  END IF;
END $$;
