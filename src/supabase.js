import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'your_url_here' &&
  supabaseAnonKey !== 'your_key_here' &&
  supabaseUrl.startsWith('https://');

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
