const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const { authenticateToken } = require('../middleware/auth');

// Get all projects
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    // Parse specific JSON fields if they are stored as strings in older records or plain TEXT columns
    // Supabase JS client automatically parses JSON columns, but if we used TEXT for 'images', we might need parsing.
    // However, if we sent serialized strings, Supabase stores them.
    const parsedRows = data.map(row => {
        let images = [];
        try {
            images = typeof row.images === 'string' ? JSON.parse(row.images) : row.images;
        } catch (e) { images = []; }
        return { ...row, images: images || [] };
    });
    res.json(parsedRows);
});

// Get single project
router.get('/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', req.params.id)
        .single();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Project not found' });

    let images = [];
    try {
        images = typeof data.images === 'string' ? JSON.parse(data.images) : data.images;
    } catch (e) { images = []; }

    res.json({ ...data, images: images || [] });
});

// Create project (Auth required)
router.post('/', authenticateToken, async (req, res) => {
    const { title, client, location, service_type, description, challenge, solution, result, images, completion_date } = req.body;
    // Store as JSON string if column is TEXT. If JSONB, pass object. 
    // We defined it as TEXT in `supabase_schema.sql` (images TEXT).
    const imagesJson = JSON.stringify(images || []);

    const { data, error } = await supabase
        .from('projects')
        .insert([{
            title, client, location, service_type, description, challenge, solution, result, images: imagesJson, completion_date
        }])
        .select(); // Select to return the created row

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// Update project (Auth required)
router.put('/:id', authenticateToken, async (req, res) => {
    const { title, client, location, service_type, description, challenge, solution, result, images, completion_date } = req.body;
    const imagesJson = JSON.stringify(images || []);

    const { data, error } = await supabase
        .from('projects')
        .update({
            title, client, location, service_type, description, challenge, solution, result, images: imagesJson, completion_date
        })
        .eq('id', req.params.id)
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// Delete project (Auth required)
router.delete('/:id', authenticateToken, async (req, res) => {
    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Deleted", id: req.params.id });
});

module.exports = router;
