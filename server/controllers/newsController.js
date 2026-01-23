import supabase from '../supabase.js';

const getAllNews = async (req, res) => {
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    // Map snake_case to camelCase
    const mappedData = data.map(item => ({
        ...item,
        imageUrl: item.image_url,
        videoUrl: item.video_url,
        audioUrl: item.audio_url,
        metaTitle: item.meta_title,
        metaDescription: item.meta_description
    }));

    res.json(mappedData);
};

const getNewsById = async (req, res) => {
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', req.params.id)
        .single();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: "News not found" });

    // Map snake_case to camelCase
    const mappedItem = {
        ...data,
        imageUrl: data.image_url,
        videoUrl: data.video_url,
        audioUrl: data.audio_url,
        metaTitle: data.meta_title,
        metaDescription: data.meta_description
    };

    res.json(mappedItem);
};

const getRelatedNews = async (req, res) => {
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .neq('id', req.params.id)
        .order('date', { ascending: false })
        .limit(3);

    if (error) return res.status(500).json({ error: error.message });
    const mappedData = (data || []).map(item => ({
        ...item,
        imageUrl: item.image_url,
        videoUrl: item.video_url,
        audioUrl: item.audio_url,
        metaTitle: item.meta_title,
        metaDescription: item.meta_description
    }));

    res.json(mappedData);
};

const createNews = async (req, res) => {
    const { title, category, date, imageUrl, excerpt, content, author, videoUrl, audioUrl, attachments, metaTitle, metaDescription, keywords } = req.body;
    const attachmentsStr = attachments ? JSON.stringify(attachments) : null;

    // Convert Vietnamese date format (dd/mm/yyyy) to ISO format (yyyy-mm-dd) for PostgreSQL
    let isoDate = null;
    if (date && typeof date === 'string') {
        const parts = date.split('/');
        if (parts.length === 3) {
            // Vietnamese format: dd/mm/yyyy
            isoDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        } else if (date.includes('-')) {
            // Already ISO format
            isoDate = date;
        }
    }

    console.log('[newsController] createNews called with:', { title, category, date: isoDate, imageUrl, excerpt, author });

    const { data, error } = await supabase
        .from('news')
        .insert([{
            title,
            category,
            date: isoDate,
            image_url: imageUrl || null,
            excerpt: excerpt || null,
            content,
            author: author || null,
            video_url: videoUrl || null,
            audio_url: audioUrl || null,
            attachments: attachmentsStr,
            meta_title: metaTitle || null,
            meta_description: metaDescription || null,
            keywords: keywords || null
        }])
        .select();

    if (error) {
        console.error('[newsController] Supabase error:', error);
        return res.status(500).json({ error: error.message });
    }
    res.json(data[0]);
};

const updateNews = async (req, res) => {
    const { title, category, date, imageUrl, excerpt, content, author, videoUrl, audioUrl, attachments, metaTitle, metaDescription, keywords } = req.body;
    const attachmentsStr = attachments ? JSON.stringify(attachments) : null;

    // Convert Vietnamese date format (dd/mm/yyyy) to ISO format (yyyy-mm-dd) for PostgreSQL
    let isoDate = null;
    if (date && typeof date === 'string') {
        const parts = date.split('/');
        if (parts.length === 3) {
            // Vietnamese format: dd/mm/yyyy
            isoDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        } else if (date.includes('-')) {
            // Already ISO format
            isoDate = date;
        }
    }

    const { data, error } = await supabase
        .from('news')
        .update({
            title,
            category,
            date: isoDate,
            image_url: imageUrl || null,
            excerpt: excerpt || null,
            content,
            author: author || null,
            video_url: videoUrl || null,
            audio_url: audioUrl || null,
            attachments: attachmentsStr,
            meta_title: metaTitle || null,
            meta_description: metaDescription || null,
            keywords: keywords || null
        })
        .eq('id', req.params.id)
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
};

const deleteNews = async (req, res) => {
    const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Deleted", id: req.params.id });
};

export {
    getAllNews,
    getNewsById,
    getRelatedNews,
    createNews,
    updateNews,
    deleteNews
};
