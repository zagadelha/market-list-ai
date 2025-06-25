import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eifgnwxurwjemvjudhth.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpZmdud3h1cndqZW12anVkaHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNTA2ODQsImV4cCI6MjA2NTcyNjY4NH0.e5PNiCxNcmkmHwUUhQgI2gN1YcEQD69PIT-n7lFmUt4';
export const supabase = createClient(supabaseUrl, supabaseKey);