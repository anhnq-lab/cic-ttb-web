
import express from 'express';
const router = express.Router();
import supabase from '../supabase.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

// === PUBLIC ROUTES ===

// Get all active courses
router.get('/courses', async (req, res) => {
    try {
        if (!supabase) {
            return res.status(500).json({ error: "Database Connection Error: Supabase client not initialized" });
        }
        
        const { data, error } = await supabase
            .from('training_courses')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single course by slug
router.get('/courses/:slug', async (req, res) => {
    try {
        if (!supabase) {
            return res.status(500).json({ error: "Database Connection Error: Supabase client not initialized" });
        }
        
        const { data, error } = await supabase
            .from('training_courses')
            .select('*')
            .eq('slug', req.params.slug)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }
        
        if (!data) {
            return res.status(404).json({ error: 'Course not found' });
        }
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit a lead
router.post('/leads', async (req, res) => {
    try {
        if (!supabase) {
            return res.status(500).json({ error: "Database Connection Error: Supabase client not initialized" });
        }
        
        const { name, email, phone, company, position, course_id, message } = req.body;
        const { data, error } = await supabase
            .from('leads')
            .insert([{ name, email, phone, company, position, course_id, message, status: 'new' }])
            .select()
            .single();

        if (error) {
            console.error("Error creating lead:", error);
            throw error;
        }
        
        if (!data) {
            return res.status(500).json({ error: 'Failed to create lead - no data returned' });
        }
        
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// === ADMIN ROUTES (Shielded) ===

// Get all courses (including inactive)
router.get('/admin/courses', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('training_courses')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add course
router.post('/courses', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('training_courses')
            .insert([req.body])
            .select()
            .single();

        if (error) {
            console.error("Error creating course:", error);
            throw error;
        }
        
        if (!data) {
            return res.status(500).json({ error: 'Failed to create course - no data returned' });
        }
        
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update course
router.put('/courses/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('training_courses')
            .update(req.body)
            .eq('id', req.params.id)
            .select()
            .maybeSingle();

        if (error && error.code !== 'PGRST116') {
            console.error("Error updating course:", error);
            throw error;
        }
        
        if (!data) {
            return res.status(404).json({ error: 'Course not found' });
        }
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete course
router.delete('/courses/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { error } = await supabase
            .from('training_courses')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all leads
router.get('/leads', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update lead status
router.patch('/leads/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const { data, error } = await supabase
            .from('leads')
            .update({ status })
            .eq('id', req.params.id)
            .select()
            .maybeSingle();

        if (error && error.code !== 'PGRST116') {
            console.error("Error updating lead:", error);
            throw error;
        }
        
        if (!data) {
            return res.status(404).json({ error: 'Lead not found' });
        }
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
