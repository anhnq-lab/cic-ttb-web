import express from 'express';
const router = express.Router();
import supabase from '../supabase.js';
import { authenticateToken } from '../middleware/auth.js';

// Get all projects
router.get('/', async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Database Connection Error: Supabase client not initialized" });
    }
    
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    // Parse JSON fields and map database columns to frontend expected format
    const parsedRows = (data || []).map(row => {
        // Handle images - can be JSON string, array, or single URL string
        let images = [];
        try {
            if (typeof row.images === 'string') {
                // Try to parse as JSON array
                const parsed = JSON.parse(row.images);
                images = Array.isArray(parsed) ? parsed : [parsed];
            } else if (Array.isArray(row.images)) {
                images = row.images;
            } else if (row.imageUrl) {
                // Fallback to old imageUrl column
                images = [row.imageUrl];
            }
        } catch (e) {
            // If JSON parse fails, treat as single image URL
            images = row.images ? [row.images] : (row.imageUrl ? [row.imageUrl] : []);
        }

        return {
            ...row,
            // Map database fields to frontend expected fields
            title: row.title || row.name || 'Untitled Project',
            client: row.client || row.investor || '',
            service_type: row.service_type || row.type || 'Scan-to-BIM',
            completion_date: row.completion_date || row.endDate || null,
            status: row.status || 'active',
            images
        };
    });
    res.json(parsedRows);
});

// Get single project
router.get('/:id', async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Database Connection Error: Supabase client not initialized" });
    }
    
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', req.params.id)
        .maybeSingle();

    if (error && error.code !== 'PGRST116') {
        return res.status(500).json({ error: error.message });
    }
    if (!data) return res.status(404).json({ error: 'Project not found' });

    // Handle images parsing
    let images = [];
    try {
        if (typeof data.images === 'string') {
            const parsed = JSON.parse(data.images);
            images = Array.isArray(parsed) ? parsed : [parsed];
        } else if (Array.isArray(data.images)) {
            images = data.images;
        } else if (data.imageUrl) {
            images = [data.imageUrl];
        }
    } catch (e) {
        images = data.images ? [data.images] : (data.imageUrl ? [data.imageUrl] : []);
    }

    // Map fields to frontend expected format
    res.json({
        ...data,
        title: data.title || data.name || 'Untitled Project',
        client: data.client || data.investor || '',
        service_type: data.service_type || data.type || 'Scan-to-BIM',
        completion_date: data.completion_date || data.endDate || null,
        status: data.status || 'active',
        images
    });
});

// Create project (Auth required)
router.post('/', authenticateToken, async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Database Connection Error: Supabase client not initialized" });
    }
    
    const { title, client, location, service_type, description, challenge, solution, result, images, completion_date, content, scope_of_work, status } = req.body;

    // Ensure images is a JSON string
    const imagesStr = images ? JSON.stringify(images) : '[]';

    try {
        const { data, error } = await supabase
            .from('projects')
            .insert([{
                // Map frontend 'title' to database column 'name'
                name: title,
                // Map frontend 'client' to database column 'investor'
                investor: client,
                location,
                // Map frontend 'service_type' to database column 'type'
                type: service_type,
                description,
                challenge,
                solution,
                result,
                images: imagesStr,
                // Map frontend 'completion_date' to database column 'endDate'
                // Convert empty string to null for PostgreSQL date compatibility
                endDate: completion_date || null,
                content,
                scope_of_work,
                status: status || 'published'
            }])
            .select();

        if (error) {
            console.error('[Backend] Error creating project:', error);
            return res.status(500).json({ error: error.message, details: error });
        }

        if (!data || !data[0]) {
            console.error('[Backend] No data returned from insert:', { data, error });
            return res.status(500).json({ error: 'Failed to create project - no data returned' });
        }

        console.log('[Backend] Project created successfully:', data[0].id);
        return res.json(data[0]);
    } catch (err) {
        console.error('[Backend] Unexpected error creating project:', err);
        return res.status(500).json({ error: 'Internal server error', message: err.message });
    }
});

// Update project (Auth required)
router.put('/:id', authenticateToken, async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Database Connection Error: Supabase client not initialized" });
    }
    
    const { title, client, location, service_type, description, challenge, solution, result, images, completion_date, content, scope_of_work, status } = req.body;
    const imagesStr = images ? JSON.stringify(images) : '[]';

    try {
        const { data, error } = await supabase
            .from('projects')
            .update({
                // Map frontend fields to database columns
                name: title,
                investor: client,
                location,
                type: service_type,
                description,
                challenge,
                solution,
                result,
                images: imagesStr,
                // Convert empty string to null for PostgreSQL date compatibility  
                endDate: completion_date || null,
                content,
                scope_of_work,
                status: status || 'published'
            })
            .eq('id', req.params.id)
            .select();

        if (error) {
            console.error('[Backend] Error updating project:', error);
            return res.status(500).json({ error: error.message, details: error });
        }

        if (!data || !data[0]) {
            console.error('[Backend] No data returned from update:', { data, error, projectId: req.params.id });
            return res.status(404).json({ error: 'Project not found or update failed' });
        }

        console.log('[Backend] Project updated successfully:', data[0].id);
        return res.json(data[0]);
    } catch (err) {
        console.error('[Backend] Unexpected error updating project:', err);
        return res.status(500).json({ error: 'Internal server error', message: err.message });
    }
});

// Sync Webhook (Compatible with Supabase Database Webhooks)
router.post('/sync-webhook', async (req, res) => {
    try {
        if (!supabase) {
            return res.status(500).json({ error: "Database Connection Error: Supabase client not initialized" });
        }
        
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
            name: projectData.title || projectData.name || 'Synced Project',
            description: projectData.description || '',
            content: projectData.content || projectData.body || '',
            scope_of_work: projectData.scope_of_work || projectData.scope || '',
            location: projectData.location || '',
            investor: projectData.client || '',
            endDate: projectData.completion_date || projectData.date || null,
            type: projectData.service_type || 'Scan-to-BIM',
            status: 'pending', // Always pending
            source_id: projectData.id ? String(projectData.id) : null,
            // Handle Images: If source provides array, stringify it. If string, use as is.
            images: Array.isArray(projectData.images)
                ? JSON.stringify(projectData.images)
                : (typeof projectData.images === 'string' ? projectData.images : '[]')
        };

        // 4. Upsert (Insert or Update if source_id exists)
        // First check if project with source_id exists
        let existingProject = null;
        if (mappedProject.source_id) {
            const { data: existing } = await supabase
                .from('projects')
                .select('id')
                .eq('source_id', mappedProject.source_id)
                .maybeSingle();
            existingProject = existing;
        }

        let result;
        if (existingProject) {
            // Update existing project
            const { data, error } = await supabase
                .from('projects')
                .update(mappedProject)
                .eq('id', existingProject.id)
                .select()
                .single();
            if (error) throw error;
            result = data;
        } else {
            // Insert new project
            const { data, error } = await supabase
                .from('projects')
                .insert([mappedProject])
                .select()
                .single();
            if (error) throw error;
            result = data;
        }

        console.log("Sync success for:", mappedProject.name || mappedProject.title);
        res.json({ message: 'Synced successfully', id: result.id });

    } catch (e) {
        console.error("Sync Error:", e);
        res.status(500).json({ error: e.message });
    }
});

// Delete project (Auth required)
router.delete('/:id', authenticateToken, async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Database Connection Error: Supabase client not initialized" });
    }
    
    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Deleted", id: req.params.id });
});

export default router;
