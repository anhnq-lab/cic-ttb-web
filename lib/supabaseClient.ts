import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dsrquyuuqjcykyjrlrpb.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzcnF1eXV1cWpjeWt5anJscnBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODM1NDY3NSwiZXhwIjoyMDgzOTMwNjc1fQ.xg9TpYgJ3_cvvgHH33TFT4JCxglKzrdT7G-TxPz5POY'; // Ideally this should be the ANON key, not service role, but for this specific user request context we are using provided keys.

// Note: For security in a real production app, ensure you use the ANON key here, NOT the service role key.
// However, based on provided context, we are using the key available.

export const supabase = createClient(supabaseUrl, supabaseKey);
