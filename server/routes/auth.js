const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../supabase');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password, email, fullName } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // Check availability
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .or(`username.eq.${username},email.eq.${email}`)
            .single();

        if (existingUser) {
            return res.status(400).json({ error: "Username or Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { data: newUser, error } = await supabase
            .from('users')
            .insert([{
                username,
                password_hash: hashedPassword,
                email,
                full_name: fullName || username,
                role: 'user',
                provider: 'local'
            }])
            .select()
            .single();

        if (error) throw error;

        res.json({ message: "Registration successful", user: { id: newUser.id, username: newUser.username } });

    } catch (e) {
        console.error("Register Error:", e);
        res.status(500).json({ error: e.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        console.log("Login request received:", req.body); // Debug log
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // Secure Admin Login
        const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
        const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123'; // Fallback only for dev

        console.log(`Checking Admin: Input=${username}, Expected=${ADMIN_USER}, PassMatch=${password === ADMIN_PASS}`);

        if (username === ADMIN_USER && password === ADMIN_PASS) {
            console.log("Attempting Master Admin Login");
            try {
                if (!JWT_SECRET) throw new Error("JWT_SECRET is missing");
                const token = jwt.sign({ id: 999, username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
                console.log("Master Admin Login Success");
                return res.json({ token, user: { id: 999, username: 'admin', role: 'admin' } });
            } catch (err) {
                console.error("JWT Sign Error:", err);
                return res.status(500).json({ error: "Internal Auth Error: " + err.message });
            }
        }

        // Check if Supabase is initialized
        if (!supabase) {
            console.error("❌ Supabase client is null. Cannot query database.");
            return res.status(500).json({ error: "Database Connection Error: Supabase client not initialized" });
        }

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (error) {
            console.error("Supabase DB Error during login:", error);
            // If user not found, it might return a specific code, but typically .single() with no rows returns error
            if (error.code === 'PGRST116') { // JSON object returned was empty (no rows)
                console.log("User not found in DB.");
                return res.status(400).json({ error: "User not found" });
            }
            return res.status(500).json({ error: "Database error: " + error.message });
        }

        if (!user) {
            console.log("User variable is null/undefined despite no error.");
            return res.status(400).json({ error: "User not found" });
        }

        bcrypt.compare(password, user.password_hash, (err, result) => {
            if (err) {
                console.error("Bcrypt Error:", err);
                return res.status(500).json({ error: "Auth processing error" });
            }
            if (result) {
                console.log(`User ${username} logged in successfully.`);
                const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
                res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
            } else {
                console.warn(`Invalid password attempt for ${username}`);
                res.status(403).json({ error: "Invalid password" });
            }
        });
    } catch (e) {
        console.error("Global Login Error:", e);
        res.status(500).json({ error: "Server Error: " + e.message, details: e.toString() });
    }
});

// Google Login Verification
router.post('/google', async (req, res) => {
    try {
        const { token, user: googleUser } = req.body; // Token from Frontend (Supabase Auth)

        if (!googleUser || !googleUser.email) {
            return res.status(400).json({ error: "Invalid Google User Data" });
        }

        // Check if user exists in OUR database
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', googleUser.email)
            .single();

        if (existingUser) {
            // User exists, return our JWT
            const jwtToken = jwt.sign({ id: existingUser.id, username: existingUser.username, role: existingUser.role }, JWT_SECRET, { expiresIn: '24h' });
            return res.json({ token: jwtToken, user: existingUser });
        } else {
            // Create new user from Google Data
            const username = googleUser.email.split('@')[0] + '_' + Math.floor(Math.random() * 1000);

            const { data: newUser, error } = await supabase
                .from('users')
                .insert([{
                    username: username,
                    email: googleUser.email,
                    full_name: googleUser.user_metadata?.full_name || username,
                    avatar_url: googleUser.user_metadata?.avatar_url,
                    password_hash: 'google_auth_no_pass',
                    role: 'user',
                    provider: 'google',
                    auth_id: googleUser.id // Link to Supabase Auth UUID
                }])
                .select()
                .single();

            if (error) throw error;

            const jwtToken = jwt.sign({ id: newUser.id, username: newUser.username, role: newUser.role }, JWT_SECRET, { expiresIn: '24h' });
            return res.json({ token: jwtToken, user: newUser });
        }

    } catch (e) {
        console.error("Google Auth Error:", e);
        res.status(500).json({ error: e.message });
    }
});


// Get Current User
router.get('/me', authenticateToken, (req, res) => {
    res.json(req.user);
});

module.exports = router;
