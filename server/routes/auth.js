const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(400).json({ error: "User not found" });

        bcrypt.compare(password, user.password_hash, (err, result) => {
            if (result) {
                const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
                res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
            } else {
                res.status(403).json({ error: "Invalid password" });
            }
        });
    });
});

// Get Current User
router.get('/me', authenticateToken, (req, res) => {
    res.json(req.user);
});

module.exports = router;
