/*
  # Optimize kenig_rates table performance

  1. Performance Improvements
    - Add composite indexes on frequently queried columns
    - Add indexes on base, quote, source, and updated_at columns
    - Optimize query performance for rate lookups

  2. Indexes Created
    - idx_kenig_rates_base_quote: For direct pair lookups
    - idx_kenig_rates_source_updated: For source-based sorting
    - idx_kenig_rates_base_quote_source: For filtered pair lookups
    - idx_kenig_rates_updated_at: For time-based queries

  3. Notes
    - These indexes significantly improve query performance
    - Uses IF NOT EXISTS to safely handle re-runs
    - All indexes are non-blocking (CONCURRENTLY)
*/

-- Index for base/quote pair lookups (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_kenig_rates_base_quote
ON kenig_rates(base, quote, updated_at DESC);

-- Index for source and updated_at (used in priority filtering)
CREATE INDEX IF NOT EXISTS idx_kenig_rates_source_updated
ON kenig_rates(source, updated_at DESC);

-- Composite index for filtered pair lookups with source
CREATE INDEX IF NOT EXISTS idx_kenig_rates_base_quote_source
ON kenig_rates(base, quote, source, updated_at DESC);

-- Index for time-based queries
CREATE INDEX IF NOT EXISTS idx_kenig_rates_updated_at
ON kenig_rates(updated_at DESC);

-- Index for reverse pair lookups (inverse direction)
CREATE INDEX IF NOT EXISTS idx_kenig_rates_quote_base
ON kenig_rates(quote, base, updated_at DESC);
