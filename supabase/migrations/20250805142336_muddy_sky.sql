/*
  # Create participants tracking table

  1. New Tables
    - `participants`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text) 
      - `email` (text)
      - `phone` (text)
      - `marketing_opt_in` (boolean)
      - `prize_won` (text)
      - `prize_id` (integer)
      - `entry_timestamp` (timestamptz)
      - `ip_address` (text, optional)
      - `user_agent` (text, optional)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `participants` table
    - Add policy for authenticated users to read data
    - Add policy for public insert (for the prize wheel)

  3. Indexes
    - Index on email for quick lookups
    - Index on entry_timestamp for reporting
    - Index on prize_id for prize analytics
*/

CREATE TABLE IF NOT EXISTS participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  marketing_opt_in boolean DEFAULT false,
  prize_won text NOT NULL,
  prize_id integer NOT NULL,
  entry_timestamp timestamptz NOT NULL,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- Policy for public to insert entries (prize wheel submissions)
CREATE POLICY "Allow public insert for prize entries"
  ON participants
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy for authenticated users to read all data (for admin dashboard)
CREATE POLICY "Allow authenticated users to read all entries"
  ON participants
  FOR SELECT
  TO authenticated
  USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_participants_email ON participants(email);
CREATE INDEX IF NOT EXISTS idx_participants_timestamp ON participants(entry_timestamp);
CREATE INDEX IF NOT EXISTS idx_participants_prize_id ON participants(prize_id);
CREATE INDEX IF NOT EXISTS idx_participants_marketing_opt_in ON participants(marketing_opt_in);