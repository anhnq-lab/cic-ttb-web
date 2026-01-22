// Simple Admin API - WordPress-style REST API
// Clean, simple, easy to debug

import express from 'express';
const router = express.Router();
import supabase from '../supabase.js';

// Simple auth check - just verify token exists
const checkAdmin = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.replace('Bearer ', '') || authHeader;
        
        console.log('[Admin API] Auth check:', { 
            hasAuthHeader: !!authHeader, 
            hasToken: !!token,
            method: req.method,
            path: req.path 
        });
        
        if (!token) {
            console.log('[Admin API] No token provided');
            return res.status(401).json({ success: false, error: 'No token provided' });
        }
        
        req.token = token;
        next();
    } catch (err) {
        console.error('[Admin API] Auth check error:', err);
        return res.status(500).json({ success: false, error: 'Auth check failed' });
    }
};

// ===== PROJECTS =====

// GET /api/admin/projects - Get all projects
router.get('/projects', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[Admin API] Get projects error:', error);
            return res.json({ success: false, error: error.message });
        }

        // Map database fields to frontend format
        // Database uses: name, investor, type, endDate, imageUrl
        // Frontend expects: title, client, service_type, completion_date, images
        const projects = (data || []).map(p => {
            // Handle images - could be imageUrl (string) or images (JSON string or array)
            let imagesArray = [];
            if (p.images) {
                if (typeof p.images === 'string') {
                    try {
                        imagesArray = JSON.parse(p.images);
                    } catch {
                        imagesArray = [p.images];
                    }
                } else if (Array.isArray(p.images)) {
                    imagesArray = p.images;
                }
            } else if (p.imageUrl) {
                imagesArray = [p.imageUrl];
            }

            return {
                id: p.id,
                title: p.name || p.title || 'Untitled',
                client: p.investor || p.client || '',
                location: p.location || '',
                service_type: p.type || p.service_type || 'Scan-to-BIM',
                description: p.description || '',
                challenge: p.challenge || '',
                solution: p.solution || '',
                result: p.result || '',
                images: imagesArray,
                completion_date: p.endDate || p.completion_date || null,
                content: p.content || '',
                scope_of_work: p.scope_of_work || '',
                status: p.status || 'published',
                created_at: p.created_at
            };
        });

        return res.json({ success: true, data: projects });
    } catch (err) {
        console.error('[Admin API] Get projects exception:', err);
        return res.json({ success: false, error: err.message });
    }
});

// GET /api/admin/projects/:id - Get single project
router.get('/projects/:id', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', req.params.id)
            .maybeSingle();

        if (error) {
            console.error('[Admin API] Get project error:', error);
            return res.json({ success: false, error: error.message });
        }

        if (!data) {
            return res.json({ success: false, error: 'Project not found' });
        }

        // Map to frontend format
        const project = {
            id: data.id,
            title: data.name || data.title || 'Untitled',
            client: data.investor || data.client || '',
            location: data.location || '',
            service_type: data.type || data.service_type || 'Scan-to-BIM',
            description: data.description || '',
            challenge: data.challenge || '',
            solution: data.solution || '',
            result: data.result || '',
            images: typeof data.images === 'string' ? JSON.parse(data.images || '[]') : (data.images || []),
            completion_date: data.endDate || data.completion_date || null,
            content: data.content || '',
            scope_of_work: data.scope_of_work || '',
            status: data.status || 'published',
            created_at: data.created_at
        };

        return res.json({ success: true, data: project });
    } catch (err) {
        console.error('[Admin API] Get project exception:', err);
        return res.json({ success: false, error: err.message });
    }
});

// POST /api/admin/projects - Create project
router.post('/projects', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { title, client, location, service_type, description, challenge, solution, result, images, completion_date, content, scope_of_work, status } = req.body;

        // Prepare data for database
        const dbData = {
            name: title || 'Untitled Project',
            investor: client || null,
            location: location || null,
            type: service_type || 'Scan-to-BIM',
            description: description || null,
            challenge: challenge || null,
            solution: solution || null,
            result: result || null,
            images: Array.isArray(images) ? JSON.stringify(images) : (typeof images === 'string' ? images : '[]'),
            endDate: completion_date || null,
            content: content || null,
            scope_of_work: scope_of_work || null,
            status: status || 'published'
        };

        console.log('[Admin API] Creating project with data:', {
            name: dbData.name,
            hasImages: !!dbData.images,
            imagesType: typeof dbData.images
        });

        const { data, error } = await supabase
            .from('projects')
            .insert([dbData])
            .select();

        if (error) {
            console.error('[Admin API] Create project error:', error);
            return res.json({ success: false, error: error.message });
        }

        if (!data || data.length === 0) {
            return res.json({ success: false, error: 'Failed to create project' });
        }

        // Get the first (and should be only) created record
        const newProject = data[0];

        // Handle images - could be imageUrl (string) or images (JSON string or array)
        let imagesArray = [];
        if (newProject.images) {
            if (typeof newProject.images === 'string') {
                try {
                    imagesArray = JSON.parse(newProject.images);
                } catch {
                    imagesArray = [newProject.images];
                }
            } else if (Array.isArray(newProject.images)) {
                imagesArray = newProject.images;
            }
        } else if (newProject.imageUrl) {
            imagesArray = [newProject.imageUrl];
        }

        // Map back to frontend format
        const project = {
            id: newProject.id,
            title: newProject.name || newProject.title || 'Untitled',
            client: newProject.investor || newProject.client || '',
            location: newProject.location || '',
            service_type: newProject.type || newProject.service_type || 'Scan-to-BIM',
            description: newProject.description || '',
            challenge: newProject.challenge || '',
            solution: newProject.solution || '',
            result: newProject.result || '',
            images: imagesArray,
            completion_date: newProject.endDate || newProject.completion_date || null,
            content: newProject.content || '',
            scope_of_work: newProject.scope_of_work || '',
            status: newProject.status || 'published',
            created_at: newProject.created_at
        };

        return res.json({ success: true, data: project });
    } catch (err) {
        console.error('[Admin API] Create project exception:', err);
        return res.json({ success: false, error: err.message });
    }
});

// PUT /api/admin/projects/:id - Update project
router.put('/projects/:id', checkAdmin, async (req, res) => {
    try {
        console.log('[Admin API] Update project request:', { 
            id: req.params.id, 
            bodyKeys: Object.keys(req.body),
            hasTitle: !!req.body.title 
        });

        if (!supabase) {
            console.error('[Admin API] Supabase not initialized');
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { title, client, location, service_type, description, challenge, solution, result, images, completion_date, content, scope_of_work, status } = req.body;
        const projectId = req.params.id;

        console.log('[Admin API] Looking for project:', projectId);

        // First check if project exists - try both UUID and integer
        let existing = null;
        let checkError = null;
        
        // Try UUID first (Supabase handles UUID automatically)
        const { data: uuidData, error: uuidError } = await supabase
            .from('projects')
            .select('id')
            .eq('id', projectId)
            .maybeSingle();
        
        if (uuidError) {
            console.error('[Admin API] UUID check error:', uuidError);
            checkError = uuidError;
        } else if (uuidData) {
            existing = uuidData;
            console.log('[Admin API] Project found by UUID:', projectId);
        } else {
            console.log('[Admin API] Project not found by UUID, trying other methods...');
            // If UUID doesn't work, the project might not exist
            // But let's log what we're looking for
            console.log('[Admin API] Project ID type:', typeof projectId, 'value:', projectId);
        }

        if (checkError) {
            console.error('[Admin API] Check project error:', checkError);
            return res.json({ success: false, error: checkError.message });
        }

        if (!existing) {
            console.log('[Admin API] Project not found:', projectId);
            return res.json({ success: false, error: `Project not found: ${projectId}` });
        }

        // Use the ID from existing to ensure we have the correct format
        const actualProjectId = existing.id;
        console.log('[Admin API] Project found, updating...', { requestedId: projectId, actualId: actualProjectId });

        // Prepare update data
        const updateData = {
            name: title,
            investor: client,
            location: location,
            type: service_type,
            description: description,
            challenge: challenge,
            solution: solution,
            result: result,
            images: Array.isArray(images) ? JSON.stringify(images) : (images || '[]'),
            endDate: completion_date || null,
            content: content,
            scope_of_work: scope_of_work,
            status: status || 'published'
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        console.log('[Admin API] Update data prepared:', Object.keys(updateData));

        const { data, error } = await supabase
            .from('projects')
            .update(updateData)
            .eq('id', actualProjectId)
            .select();

        if (error) {
            console.error('[Admin API] Update project error:', error);
            return res.json({ success: false, error: error.message });
        }

        if (!data || data.length === 0) {
            console.error('[Admin API] No data returned from update');
            return res.json({ success: false, error: 'Update failed - no data returned' });
        }

        // Get the first (and should be only) updated record
        const updatedProject = data[0];

        // Handle images - could be imageUrl (string) or images (JSON string or array)
        let imagesArray = [];
        if (updatedProject.images) {
            if (typeof updatedProject.images === 'string') {
                try {
                    imagesArray = JSON.parse(updatedProject.images);
                } catch {
                    imagesArray = [updatedProject.images];
                }
            } else if (Array.isArray(updatedProject.images)) {
                imagesArray = updatedProject.images;
            }
        } else if (updatedProject.imageUrl) {
            imagesArray = [updatedProject.imageUrl];
        }

        // Map back to frontend format
        const project = {
            id: updatedProject.id,
            title: updatedProject.name || updatedProject.title || 'Untitled',
            client: updatedProject.investor || updatedProject.client || '',
            location: updatedProject.location || '',
            service_type: updatedProject.type || updatedProject.service_type || 'Scan-to-BIM',
            description: updatedProject.description || '',
            challenge: updatedProject.challenge || '',
            solution: updatedProject.solution || '',
            result: updatedProject.result || '',
            images: imagesArray,
            completion_date: updatedProject.endDate || updatedProject.completion_date || null,
            content: updatedProject.content || '',
            scope_of_work: updatedProject.scope_of_work || '',
            status: updatedProject.status || 'published',
            created_at: updatedProject.created_at
        };

        return res.json({ success: true, data: project });
    } catch (err) {
        console.error('[Admin API] Update project exception:', err);
        return res.json({ success: false, error: err.message });
    }
});

// DELETE /api/admin/projects/:id - Delete project
router.delete('/projects/:id', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', req.params.id);

        if (error) {
            console.error('[Admin API] Delete project error:', error);
            return res.json({ success: false, error: error.message });
        }

        return res.json({ success: true, message: 'Project deleted' });
    } catch (err) {
        console.error('[Admin API] Delete project exception:', err);
        return res.json({ success: false, error: err.message });
    }
});

// ===== NEWS =====

// GET /api/admin/news - Get all news
router.get('/news', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { data, error } = await supabase
            .from('news')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return res.json({ success: false, error: error.message });
        }

        // Map database fields to frontend format
        const news = (data || []).map(n => ({
            id: n.id,
            title: n.title || '',
            category: n.category || 'Tin tức',
            date: n.date || null,
            imageUrl: n.image_url || '',
            excerpt: n.excerpt || '',
            content: n.content || '',
            author: n.author || '',
            videoUrl: n.video_url || '',
            audioUrl: n.audio_url || '',
            attachments: typeof n.attachments === 'string' ? JSON.parse(n.attachments || '[]') : (n.attachments || []),
            metaTitle: n.meta_title || '',
            metaDescription: n.meta_description || '',
            keywords: n.keywords || '',
            created_at: n.created_at
        }));

        return res.json({ success: true, data: news });
    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

// POST /api/admin/news - Create news
router.post('/news', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { title, category, date, imageUrl, excerpt, content, author, videoUrl, audioUrl, attachments, metaTitle, metaDescription, keywords } = req.body;

        // Convert date format
        let isoDate = null;
        if (date && typeof date === 'string') {
            const parts = date.split('/');
            if (parts.length === 3) {
                isoDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            } else if (date.includes('-')) {
                isoDate = date;
            }
        }

        const attachmentsStr = attachments ? JSON.stringify(attachments) : null;

        const { data, error } = await supabase
            .from('news')
            .insert([{
                title,
                category: category || 'Tin tức',
                date: isoDate,
                image_url: imageUrl || null,
                excerpt: excerpt || null,
                content: content || '',
                author: author || null,
                video_url: videoUrl || null,
                audio_url: audioUrl || null,
                attachments: attachmentsStr,
                meta_title: metaTitle || null,
                meta_description: metaDescription || null,
                keywords: keywords || null
            }])
            .select()
            .single();

        if (error) {
            return res.json({ success: false, error: error.message });
        }

        if (!data) {
            return res.json({ success: false, error: 'Failed to create news' });
        }

        // Map back to frontend format
        const news = {
            id: data.id,
            title: data.title || '',
            category: data.category || 'Tin tức',
            date: data.date || null,
            imageUrl: data.image_url || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
            author: data.author || '',
            videoUrl: data.video_url || '',
            audioUrl: data.audio_url || '',
            attachments: typeof data.attachments === 'string' ? JSON.parse(data.attachments || '[]') : (data.attachments || []),
            metaTitle: data.meta_title || '',
            metaDescription: data.meta_description || '',
            keywords: data.keywords || '',
            created_at: data.created_at
        };

        return res.json({ success: true, data: news });
    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

// PUT /api/admin/news/:id - Update news
router.put('/news/:id', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { title, category, date, imageUrl, excerpt, content, author, videoUrl, audioUrl, attachments, metaTitle, metaDescription, keywords } = req.body;

        // Convert date format
        let isoDate = null;
        if (date && typeof date === 'string') {
            const parts = date.split('/');
            if (parts.length === 3) {
                isoDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            } else if (date.includes('-')) {
                isoDate = date;
            }
        }

        const attachmentsStr = attachments ? JSON.stringify(attachments) : null;

        const { data, error } = await supabase
            .from('news')
            .update({
                title,
                category: category || 'Tin tức',
                date: isoDate,
                image_url: imageUrl || null,
                excerpt: excerpt || null,
                content: content || '',
                author: author || null,
                video_url: videoUrl || null,
                audio_url: audioUrl || null,
                attachments: attachmentsStr,
                meta_title: metaTitle || null,
                meta_description: metaDescription || null,
                keywords: keywords || null
            })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) {
            return res.json({ success: false, error: error.message });
        }

        if (!data) {
            return res.json({ success: false, error: 'News not found' });
        }

        // Map back to frontend format
        const news = {
            id: data.id,
            title: data.title || '',
            category: data.category || 'Tin tức',
            date: data.date || null,
            imageUrl: data.image_url || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
            author: data.author || '',
            videoUrl: data.video_url || '',
            audioUrl: data.audio_url || '',
            attachments: typeof data.attachments === 'string' ? JSON.parse(data.attachments || '[]') : (data.attachments || []),
            metaTitle: data.meta_title || '',
            metaDescription: data.meta_description || '',
            keywords: data.keywords || '',
            created_at: data.created_at
        };

        return res.json({ success: true, data: news });
    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

// DELETE /api/admin/news/:id - Delete news
router.delete('/news/:id', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { error } = await supabase
            .from('news')
            .delete()
            .eq('id', req.params.id);

        if (error) {
            return res.json({ success: false, error: error.message });
        }

        return res.json({ success: true, message: 'News deleted' });
    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

// ===== TRAINING / COURSES =====

// GET /api/admin/courses - Get all courses
router.get('/courses', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { data, error } = await supabase
            .from('training_courses')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return res.json({ success: false, error: error.message });
        }

        return res.json({ success: true, data: data || [] });
    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

// POST /api/admin/courses - Create course
router.post('/courses', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { data, error } = await supabase
            .from('training_courses')
            .insert([req.body])
            .select()
            .single();

        if (error) {
            return res.json({ success: false, error: error.message });
        }

        if (!data) {
            return res.json({ success: false, error: 'Failed to create course' });
        }

        return res.json({ success: true, data });
    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

// PUT /api/admin/courses/:id - Update course
router.put('/courses/:id', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { data, error } = await supabase
            .from('training_courses')
            .update(req.body)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) {
            return res.json({ success: false, error: error.message });
        }

        if (!data) {
            return res.json({ success: false, error: 'Course not found' });
        }

        return res.json({ success: true, data });
    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

// DELETE /api/admin/courses/:id - Delete course
router.delete('/courses/:id', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { error } = await supabase
            .from('training_courses')
            .delete()
            .eq('id', req.params.id);

        if (error) {
            return res.json({ success: false, error: error.message });
        }

        return res.json({ success: true, message: 'Course deleted' });
    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

// ===== LIBRARY =====

// GET /api/admin/library - Get all library items
router.get('/library', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { data, error } = await supabase
            .from('library')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return res.json({ success: false, error: error.message });
        }

        return res.json({ success: true, data: data || [] });
    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

// POST /api/admin/library - Create library item
router.post('/library', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { title, type, description, tag, image_url, link } = req.body;

        const { data, error } = await supabase
            .from('library')
            .insert([{ title, type, description, tag, image_url, link }])
            .select()
            .single();

        if (error) {
            return res.json({ success: false, error: error.message });
        }

        if (!data) {
            return res.json({ success: false, error: 'Failed to create library item' });
        }

        return res.json({ success: true, data });
    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

// PUT /api/admin/library/:id - Update library item
router.put('/library/:id', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { title, type, description, tag, image_url, link } = req.body;

        const { data, error } = await supabase
            .from('library')
            .update({ title, type, description, tag, image_url, link })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) {
            return res.json({ success: false, error: error.message });
        }

        if (!data) {
            return res.json({ success: false, error: 'Library item not found' });
        }

        return res.json({ success: true, data });
    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

// DELETE /api/admin/library/:id - Delete library item
router.delete('/library/:id', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { error } = await supabase
            .from('library')
            .delete()
            .eq('id', req.params.id);

        if (error) {
            return res.json({ success: false, error: error.message });
        }

        return res.json({ success: true, message: 'Library item deleted' });
    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

// ===== CONTACTS =====

// GET /api/admin/contacts - Get all contacts
router.get('/contacts', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return res.json({ success: false, error: error.message });
        }

        return res.json({ success: true, data: data || [] });
    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

// DELETE /api/admin/contacts/:id - Delete contact
router.delete('/contacts/:id', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { error } = await supabase
            .from('contacts')
            .delete()
            .eq('id', req.params.id);

        if (error) {
            return res.json({ success: false, error: error.message });
        }

        return res.json({ success: true, message: 'Contact deleted' });
    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

// ===== TOOLS =====

// GET /api/admin/tools - Get all tools
router.get('/tools', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { data, error } = await supabase
            .from('tools')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return res.json({ success: false, error: error.message });
        }

        return res.json({ success: true, data: data || [] });
    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

// POST /api/admin/tools - Create tool
router.post('/tools', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { title, description, icon, link } = req.body;

        const { data, error } = await supabase
            .from('tools')
            .insert([{ title, description, icon, link }])
            .select()
            .single();

        if (error) {
            return res.json({ success: false, error: error.message });
        }

        if (!data) {
            return res.json({ success: false, error: 'Failed to create tool' });
        }

        return res.json({ success: true, data });
    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

// PUT /api/admin/tools/:id - Update tool
router.put('/tools/:id', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { title, description, icon, link } = req.body;

        const { data, error } = await supabase
            .from('tools')
            .update({ title, description, icon, link })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) {
            return res.json({ success: false, error: error.message });
        }

        if (!data) {
            return res.json({ success: false, error: 'Tool not found' });
        }

        return res.json({ success: true, data });
    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

// DELETE /api/admin/tools/:id - Delete tool
router.delete('/tools/:id', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { error } = await supabase
            .from('tools')
            .delete()
            .eq('id', req.params.id);

        if (error) {
            return res.json({ success: false, error: error.message });
        }

        return res.json({ success: true, message: 'Tool deleted' });
    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

// ===== PRICING =====

// GET /api/admin/pricing - Get all pricing
router.get('/pricing', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { data, error } = await supabase
            .from('pricing')
            .select('*');

        if (error) {
            return res.json({ success: false, error: error.message });
        }

        // Parse features JSON
        const pricing = (data || []).map(p => ({
            ...p,
            features: p.features ? JSON.parse(p.features) : [],
            isPopular: p.is_popular === 1 || p.is_popular === true
        }));

        return res.json({ success: true, data: pricing });
    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

// PUT /api/admin/pricing/:id - Update pricing
router.put('/pricing/:id', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { name, price, period, description, features, ctaText, isPopular } = req.body;
        const featuresStr = JSON.stringify(features || []);

        const { data, error } = await supabase
            .from('pricing')
            .update({
                name,
                price,
                period,
                description,
                features: featuresStr,
                cta_text: ctaText || null,
                is_popular: isPopular ? 1 : 0
            })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) {
            return res.json({ success: false, error: error.message });
        }

        if (!data) {
            return res.json({ success: false, error: 'Pricing not found' });
        }

        // Map back to frontend format
        const pricing = {
            ...data,
            features: data.features ? JSON.parse(data.features) : [],
            isPopular: data.is_popular === 1 || data.is_popular === true
        };

        return res.json({ success: true, data: pricing });
    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

// ===== SETTINGS =====

// GET /api/admin/settings - Get settings
router.get('/settings', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const { data, error } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'general')
            .maybeSingle();

        if (error && error.code !== 'PGRST116') {
            return res.json({ success: false, error: error.message });
        }

        const settings = data ? JSON.parse(data.value) : {};

        return res.json({ success: true, data: settings });
    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

// POST /api/admin/settings - Update settings
router.post('/settings', checkAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ success: false, error: 'Database not connected' });
        }

        const settings = JSON.stringify(req.body);

        // Check if settings exist
        const { data: existing } = await supabase
            .from('settings')
            .select('key')
            .eq('key', 'general')
            .maybeSingle();

        let result;
        if (existing) {
            // Update existing
            const { data, error } = await supabase
                .from('settings')
                .update({ value: settings })
                .eq('key', 'general')
                .select()
                .single();
            if (error) {
                return res.json({ success: false, error: error.message });
            }
            result = data;
        } else {
            // Insert new
            const { data, error } = await supabase
                .from('settings')
                .insert([{ key: 'general', value: settings }])
                .select()
                .single();
            if (error) {
                return res.json({ success: false, error: error.message });
            }
            result = data;
        }

        return res.json({ success: true, data: req.body });
    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

export default router;
