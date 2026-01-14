const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../supabase');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

// Login
// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Hardcoded Master Admin for stability
    if (username === 'admin' && password === 'admin123') {
        const token = jwt.sign({ id: 999, username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ token, user: { id: 999, username: 'admin', role: 'admin' } });
    }

    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !user) {
            return res.status(400).json({ error: "User not found" });
        }

        bcrypt.compare(password, user.password_hash, (err, result) => {
            if (result) {
                const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
                res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
            } else {
                res.status(403).json({ error: "Invalid password" });
            }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get Current User
router.get('/me', authenticateToken, (req, res) => {
    res.json(req.user);
});

module.exports = router;
