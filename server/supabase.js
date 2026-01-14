
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role for backend to bypass RLS/Auth for admin tasks if needed, effectively acting as admin

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase URL or Key is missing. Database operations will fail.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
