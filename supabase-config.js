/* Supabase Configuration
   Store your Supabase credentials here
*/

// Replace these with your actual Supabase credentials
const SUPABASE_URL = 'https://txiuygtykydhleweziqa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4aXV5Z3R5a3lkaGxld2V6aXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzIwNDYsImV4cCI6MjA5MjQ0ODA0Nn0.xSspMj8-ZhREN-24RInkEvmu-zzz5zktRaJB44IwC6w';

// Initialize Supabase client - wait for library to load
if (typeof supabase !== 'undefined') {
  const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  window.supabaseClient = client;
  console.log('Supabase client initialized');
} else {
  console.error('Supabase library not loaded!');
}
