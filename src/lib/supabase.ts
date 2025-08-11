import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Please click "Connect to Supabase" in the top right corner to set up your database connection.')
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export interface ParticipantEntry {
  id?: string
  first_name: string
  last_name: string
  email: string
  phone: string
  marketing_opt_in: boolean
  prize_won: string
  prize_id: number
  entry_timestamp: string
  ip_address?: string
  user_agent?: string
}