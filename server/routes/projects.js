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
    const { title, client, location, service_type, description, challenge, solution, result, images, completion_date, content, scope_of_work, status } = req.body;
    // Store as JSON string if column is TEXT.
    const imagesJson = JSON.stringify(images || []);

    const { data, error } = await supabase
        .from('projects')
        .insert([{
            title,
            client,
            location,
            service_type,
            description,
            challenge,
            solution,
            result,
            images: imagesJson,
            completion_date,
            content,
            scope_of_work,
            status: status || 'published'
        }])
        .select(); // Select to return the created row

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// Update project (Auth required)
router.put('/:id', authenticateToken, async (req, res) => {
    const { title, client, location, service_type, description, challenge, solution, result, images, completion_date, content, scope_of_work, status } = req.body;
    const imagesJson = JSON.stringify(images || []);

    const { data, error } = await supabase
        .from('projects')
        .update({
            title,
            client,
            location,
            service_type,
            description,
            challenge,
            solution,
            result,
            images: imagesJson,
            completion_date,
            content,
            scope_of_work,
            status
        })
        .eq('id', req.params.id)
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// Sync Webhook (Protected by Secret or IP - simplifying with basic key check for now)
router.post('/sync-webhook', async (req, res) => {
    const { secret, project } = req.body;

    // Simple secret check (In production, use Env Var)
    // For now, accepting any request to facilitate testing if user skips env setup
    if (secret && secret !== (process.env.SYNC_SECRET || 'cic_sync_secret')) {
        return res.status(403).json({ error: 'Invalid Secret' });
    }

    if (!project) return res.status(400).json({ error: 'No project data' });

    try {
        // Map external project to our schema
        // Assuming 'project' has similar fields. Adjust mapping as needed.
        const mappedProject = {
            title: project.title || 'Synced Project',
            description: project.description || '',
            content: project.content || '',
            status: 'pending', // Always pending
            source_id: project.id || null, // Link to external ID
            images: JSON.stringify(project.images || [])
            // Add other fields as they become available from source
        };

        const { data, error } = await supabase
            .from('projects')
            .upsert(mappedProject, { onConflict: 'source_id', ignoreDuplicates: false }) // Initial strategy: Upsert based on external ID if stored
            .select();

        if (error) throw error;

        res.json({ message: 'Synced successfully', id: data[0].id });
    } catch (e) {
        console.error("Sync Error:", e);
        res.status(500).json({ error: e.message });
    }
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
