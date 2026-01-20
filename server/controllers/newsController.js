const supabase = require('../supabase');

const getAllNews = async (req, res) => {
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};

const getNewsById = async (req, res) => {
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', req.params.id)
        .single();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: "News not found" });
    res.json(data);
};

const getRelatedNews = async (req, res) => {
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .neq('id', req.params.id)
        .order('date', { ascending: false })
        .limit(3);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
};

const createNews = async (req, res) => {
    const { title, category, date, imageUrl, excerpt, content, author, videoUrl, audioUrl, attachments, metaTitle, metaDescription, keywords } = req.body;
    const attachmentsStr = attachments ? JSON.stringify(attachments) : null;

    const { data, error } = await supabase
        .from('news')
        .insert([{
            title, category, date, imageUrl, excerpt, content, author, videoUrl, audioUrl, attachments: attachmentsStr, metaTitle, metaDescription, keywords
        }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
};

const updateNews = async (req, res) => {
    const { title, category, date, imageUrl, excerpt, content, author, videoUrl, audioUrl, attachments, metaTitle, metaDescription, keywords } = req.body;
    const attachmentsStr = attachments ? JSON.stringify(attachments) : null;

    const { data, error } = await supabase
        .from('news')
        .update({
            title, category, date, imageUrl, excerpt, content, author, videoUrl, audioUrl, attachments: attachmentsStr, metaTitle, metaDescription, keywords
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

module.exports = {
    getAllNews,
    getNewsById,
    getRelatedNews,
    createNews,
    updateNews,
    deleteNews
};
