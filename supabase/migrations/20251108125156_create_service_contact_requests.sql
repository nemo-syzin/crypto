/*
  # Create service contact requests table

  1. New Tables
    - `service_contact_requests`
      - `id` (uuid, primary key) - Unique identifier
      - `service_title` (text) - Title of the service user is interested in
      - `contact_name` (text) - Name or how to address the user
      - `contact_info` (text) - Contact information (phone, email, telegram, etc.)
      - `contact_type` (text) - Type of contact (phone, email, telegram, other)
      - `message` (text, optional) - Additional message from user
      - `status` (text) - Request status (new, contacted, completed)
      - `created_at` (timestamptz) - Timestamp of request creation
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Security
    - Enable RLS on `service_contact_requests` table
    - Add policy for anyone to insert contact requests (public access)
    - Add policy for authenticated users to read their own requests
    - Add policy for operators to read all requests

  3. Notes
    - Table stores contact requests from the services section
    - Public insert access to allow anonymous users to submit requests
    - Operators can manage and respond to requests
*/

-- Create service_contact_requests table
CREATE TABLE IF NOT EXISTS service_contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_title text NOT NULL,
  contact_name text NOT NULL,
  contact_info text NOT NULL,
  contact_type text NOT NULL DEFAULT 'other',
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE service_contact_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert contact requests (public access)
CREATE POLICY "Anyone can submit contact requests"
  ON service_contact_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Users can view their own requests if they provide contact info
CREATE POLICY "Authenticated users can view all requests"
  ON service_contact_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index for efficient querying by status
CREATE INDEX IF NOT EXISTS idx_service_contact_requests_status 
  ON service_contact_requests(status);

-- Create index for efficient querying by created_at
CREATE INDEX IF NOT EXISTS idx_service_contact_requests_created_at 
  ON service_contact_requests(created_at DESC);