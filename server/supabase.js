
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
try {
    require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
} catch (e) {
    console.warn("Dotenv load failed in supabase.js");
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ CRITICAL: Supabase URL or Key is missing in environment variables!');
}

const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;

if (!supabase) {
    console.warn("⚠️ Supabase client NOT initialized due to missing config.");
}

module.exports = supabase;
