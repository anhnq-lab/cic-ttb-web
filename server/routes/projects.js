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

// Sync Webhook (Compatible with Supabase Database Webhooks)
router.post('/sync-webhook', async (req, res) => {
    try {
        const { secret } = req.query; // Supabase Webhook URL params: ?secret=...
        const payload = req.body;

        console.log("Webhook received:", JSON.stringify(payload));

        // 1. Authenticate
        // Check query param 'secret' or header 'x-supabase-signature' (if configured)
        // For simplicity/flexibility: Check query param matches env var or default
        const expectedSecret = process.env.SYNC_SECRET || 'cic_sync_secret';
        if (secret !== expectedSecret && payload.secret !== expectedSecret) {
            // Note: payload.secret logic kept for backward compatibility with manual posts
            return res.status(403).json({ error: 'Invalid Secret' });
        }

        // 2. Extract Data
        let projectData = null;

        // Case A: Supabase Native Webhook
        if (payload.type === 'INSERT' && payload.record) {
            console.log("Processing Supabase INSERT event");
            projectData = payload.record;
        }
        // Case B: Manual JSON Post
        else if (payload.project) {
            projectData = payload.project;
        }
        else {
            // Fallback: Assume the body itself is the project data if not wrapped
            projectData = payload;
        }

        if (!projectData) return res.status(400).json({ error: 'No project data found' });

        // 3. Map Data
        // Map external fields to our schema. 
        // Note: We use 'source_id' to prevent duplicate imports of the same record.
        const mappedProject = {
            title: projectData.title || projectData.name || 'Synced Project',
            description: projectData.description || '',
            content: projectData.content || projectData.body || '',
            scope_of_work: projectData.scope_of_work || projectData.scope || '',
            location: projectData.location || '',
            client: projectData.client || '',
            completion_date: projectData.completion_date || projectData.date || null,
            service_type: projectData.service_type || 'Scan-to-BIM',
            status: 'pending', // Always pending
            source_id: projectData.id ? String(projectData.id) : null,
            // Handle Images: If source provides array, stringify it. If string, use as is.
            images: Array.isArray(projectData.images)
                ? JSON.stringify(projectData.images)
                : (typeof projectData.images === 'string' ? projectData.images : '[]')
        };

        // 4. Upsert (Insert or Update if source_id exists)
        const { data, error } = await supabase
            .from('projects')
            .upsert(mappedProject, { onConflict: 'source_id', ignoreDuplicates: false })
            .select();

        if (error) throw error;

        console.log("Sync success for:", mappedProject.title);
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
