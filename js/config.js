// Supabase credentials — replace with your project values
const SUPABASE_URL = 'https://dajuybcbdxbhzlfahklk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhanV5YmNiZHhiaHpsZmFoa2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3OTc1NDEsImV4cCI6MjA5NjM3MzU0MX0.IPnMOHXWI9b9ALw0E5prEtkKkdM3h3EV1_KzW2g1ZpQ';

const sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
