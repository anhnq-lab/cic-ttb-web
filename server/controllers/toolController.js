const supabase = require('../supabase');

const getAllTools = async (req, res) => {
    const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};

const createTool = async (req, res) => {
    const { title, description, icon, link } = req.body;
    const { data, error } = await supabase
        .from('tools')
        .insert([{ title, description, icon, link }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
};

const updateTool = async (req, res) => {
    const { title, description, icon, link } = req.body;
    const { data, error } = await supabase
        .from('tools')
        .update({ title, description, icon, link })
        .eq('id', req.params.id)
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
};

const deleteTool = async (req, res) => {
    const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Deleted", id: req.params.id });
};

module.exports = {
    getAllTools,
    createTool,
    updateTool,
    deleteTool
};
