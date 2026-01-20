const supabase = require('../supabase');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
    try {
        const username = 'admin';
        const password = 'admin123';
        console.log(`Checking for user: ${username}...`);

        // Check if admin exists
        const { data: existing, error: findError } = await supabase
            .from('users')
            .select('id')
            .eq('username', username)
            .maybeSingle();

        if (findError) {
            console.error('Error checking user:', findError.message);
            return;
        }

        if (existing) {
            console.log('✅ Admin user already exists. ID:', existing.id);
            // Optional: Update password if needed, but for now just exit
            return;
        }

        console.log('Creating admin user...');
        const hashedPassword = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from('users')
            .insert([{
                username,
                password_hash: hashedPassword,
                role: 'admin',
                full_name: 'System Admin',
                email: 'admin@bimhub.vn',
                provider: 'local'
            }])
            .select();

        if (error) {
            console.error('❌ Error creating admin:', error.message);
        } else {
            console.log('✅ Admin user created successfully.');
            console.log('Username:', username);
            console.log('Password:', password);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

seedAdmin().then(() => process.exit(0));
