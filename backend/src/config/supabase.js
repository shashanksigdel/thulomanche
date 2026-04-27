import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase environment variables!');
  console.error('SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗');
  console.error('SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_KEY:', SUPABASE_SERVICE_KEY ? '✓' : '✗');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Service role client for bypassing RLS (backend only)
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Initialize tables if they don't exist
export const initializeTables = async () => {
  try {
    console.log('Supabase client initialized successfully');
    // Tables should be created via Supabase dashboard or SQL
    // This function is here for future migrations
  } catch (error) {
    console.error('Error initializing Supabase:', error);
  }
};
