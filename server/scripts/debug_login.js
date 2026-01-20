const supabase = require('../supabase');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env.local' });

async function debugLogin(username, password) {
    console.log(`\nDebugging Login for user: ${username}`);

    // 1. Env Var Check
    const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';

    console.log(`Env Check: Expected User='${ADMIN_USER}', Expected Pass='${ADMIN_PASS}'`);
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        console.log('✅ Matches Env Var Admin Credentials!');
    } else {
        console.log('❌ Does not match Env Var Admin Credentials.');
    }

    // 2. DB Check
    console.log('Checking Database...');
    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

    if (error) {
        console.log('❌ DB Error:', error);
    } else if (!user) {
        console.log('❌ User not found in DB (data is null)');
    } else {
        console.log('✅ User found in DB:', user.username, 'ID:', user.id);
        console.log('   Role:', user.role);
        console.log('   Hash:', user.password_hash);

        // 3. Password Check
        const match = await bcrypt.compare(password, user.password_hash);
        if (match) {
            console.log('✅ Password Match (Bcrypt)');
        } else {
            console.log('❌ Password DOES NOT Match (Bcrypt)');
        }
    }
}

debugLogin('admin', 'admin123').then(() => process.exit());
