import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pzgslazhagijlnrxkihc.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6Z3NsYXpoYWdpamxucnhraWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNzg5ODcsImV4cCI6MjA5Mjg1NDk4N30.5a7etKjqfiXqhJlg-gLo02kWIlcgCYA8kBlyFTu2Zws';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
