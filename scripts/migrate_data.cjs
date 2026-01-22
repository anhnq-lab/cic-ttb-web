const sqlite3 = require('sqlite3').verbose();
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: '../.env.local' });

// --- CONFIGURATION ---
// User must provide these in .env.local
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role Key to bypass RLS

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    console.log("Please create a Supabase project and add these keys.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const dbPath = path.resolve(__dirname, '../server/database.sqlite');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error("❌ Error opening SQLite database:", err.message);
        process.exit(1);
    }
    console.log("✅ Connected to SQLite database.");
});

async function migrateTable(tableName, transformFn = (x) => x) {
    console.log(`\n--- Migrating ${tableName} ---`);
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM ${tableName}`, async (err, rows) => {
            if (err) {
                console.error(`Error reading ${tableName}:`, err);
                return reject(err);
            }
            if (rows.length === 0) {
                console.log(`No data in ${tableName}.`);
                return resolve();
            }

            console.log(`Found ${rows.length} rows in ${tableName}. Uploading...`);

            // Transform data if necessary (e.g. SQLite stores everything as string sometimes)
            const data = rows.map(transformFn);

            const { error } = await supabase.from(tableName).upsert(data);

            if (error) {
                console.error(`❌ Error uploading to ${tableName}:`, error.message);
                return reject(error);
            }

            console.log(`✅ Successfully migrated ${tableName}.`);
            resolve();
        });
    });
}

// Transform functions to match Postgres schema if needed
// e.g. SQLite booleans might be 0/1, Postgres expects true/false or matches integer
const transforms = {
    pricing: (row) => ({
        ...row,
        isPopular: row.isPopular === 1 ? true : false
    }),
    // Add others if schema differs significantly
};

async function runMigration() {
    try {
        await migrateTable('users');
        await migrateTable('news');
        await migrateTable('library');
        await migrateTable('tools');
        await migrateTable('pricing', transforms.pricing);
        await migrateTable('contacts');
        await migrateTable('projects');
        await migrateTable('settings');

        console.log("\n🎉 ALl MIGRATIONS COMPLETE!");
    } catch (error) {
        console.error("\n❌ Migration Failed:", error);
    } finally {
        db.close();
    }
}

runMigration();
