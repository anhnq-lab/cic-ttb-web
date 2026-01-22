import supabase from '../supabase.js';

const getAllLibrary = async (req, res) => {
    const { data, error } = await supabase
        .from('library')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};

const createLibrary = async (req, res) => {
    const { title, type, description, tag, image_url, link } = req.body;
    const { data, error } = await supabase
        .from('library')
        .insert([{ title, type, description, tag, image_url, link }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
};

const updateLibrary = async (req, res) => {
    const { title, type, description, tag, image_url, link } = req.body;
    const { data, error } = await supabase
        .from('library')
        .update({ title, type, description, tag, image_url, link })
        .eq('id', req.params.id)
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
};

const deleteLibrary = async (req, res) => {
    const { error } = await supabase
        .from('library')
        .delete()
        .eq('id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Deleted", id: req.params.id });
};

export {
    getAllLibrary,
    createLibrary,
    updateLibrary,
    deleteLibrary
};
