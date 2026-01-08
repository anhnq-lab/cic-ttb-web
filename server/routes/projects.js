const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../middleware/auth');

// Get all projects
router.get('/', (req, res) => {
    db.all("SELECT * FROM projects ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const parsedRows = rows.map(row => ({
            ...row,
            images: row.images ? JSON.parse(row.images) : []
        }));
        res.json(parsedRows);
    });
});

// Get single project
router.get('/:id', (req, res) => {
    db.get("SELECT * FROM projects WHERE id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Project not found' });
        res.json({
            ...row,
            images: row.images ? JSON.parse(row.images) : []
        });
    });
});

// Create project (Auth required)
router.post('/', authenticateToken, (req, res) => {
    const { title, client, location, service_type, description, challenge, solution, result, images, completion_date } = req.body;
    const imagesJson = JSON.stringify(images || []);
    const stmt = db.prepare("INSERT INTO projects (title, client, location, service_type, description, challenge, solution, result, images, completion_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    stmt.run([title, client, location, service_type, description, challenge, solution, result, imagesJson, completion_date], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, ...req.body });
    });
    stmt.finalize();
});

// Update project (Auth required)
router.put('/:id', authenticateToken, (req, res) => {
    const { title, client, location, service_type, description, challenge, solution, result, images, completion_date } = req.body;
    const imagesJson = JSON.stringify(images || []);
    const stmt = db.prepare("UPDATE projects SET title=?, client=?, location=?, service_type=?, description=?, challenge=?, solution=?, result=?, images=?, completion_date=? WHERE id=?");
    stmt.run([title, client, location, service_type, description, challenge, solution, result, imagesJson, completion_date, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: req.params.id, ...req.body });
    });
    stmt.finalize();
});

// Delete project (Auth required)
router.delete('/:id', authenticateToken, (req, res) => {
    db.run("DELETE FROM projects WHERE id=?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted", id: req.params.id });
    });
});

module.exports = router;
