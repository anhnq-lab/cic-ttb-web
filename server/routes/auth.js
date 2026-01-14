const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../supabase');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

// Login
// Login
router.post('/login', async (req, res) => {
    try {
        console.log("Login request received:", req.body); // Debug log
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // Hardcoded Master Admin for stability
        if (username === 'admin' && password === 'admin123') {
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

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !user) {
            console.log("User not found or DB error:", error);
            return res.status(400).json({ error: "User not found" });
        }

        bcrypt.compare(password, user.password_hash, (err, result) => {
            if (err) {
                console.error("Bcrypt Error:", err);
                return res.status(500).json({ error: "Auth processing error" });
            }
            if (result) {
                const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
                res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
            } else {
                res.status(403).json({ error: "Invalid password" });
            }
        });
    } catch (e) {
        console.error("Global Login Error:", e);
        res.status(500).json({ error: "Server Error: " + e.message });
    }
});

// Get Current User
router.get('/me', authenticateToken, (req, res) => {
    res.json(req.user);
});

module.exports = router;
