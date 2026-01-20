
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
try {
    require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
} catch (e) {
    console.warn("Dotenv load failed in supabase.js");
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

// DEBUG LOGGING (Masked)
const hasUrl = !!supabaseUrl;
const hasKey = !!supabaseKey;
console.log(`[Supabase Config] URL Found: ${hasUrl}, Key Found: ${hasKey}`);
if (hasUrl) console.log(`[Supabase Config] URL: ${supabaseUrl.substring(0, 15)}...`);

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ CRITICAL: Supabase URL or Key is missing in environment variables!');
    // Throw error to prevent silent failures in logic
    // But for now, we leave it null so we can debug other parts if needed, 
    // though functionality will definitely break.
}

const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;

if (!supabase) {
    console.warn("⚠️ Supabase client NOT initialized due to missing config.");
}

module.exports = supabase;
