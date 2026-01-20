const supabase = require('../supabase');

const getSettings = async (req, res) => {
    const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'general')
        .single();

    if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message });

    res.json(data ? JSON.parse(data.value) : {});
};

const updateSettings = async (req, res) => {
    const settings = JSON.stringify(req.body);
    const { error } = await supabase
        .from('settings')
        .upsert([{ key: 'general', value: settings }]);

    if (error) return res.status(500).json({ error: error.message });
    res.json(req.body);
};

module.exports = {
    getSettings,
    updateSettings
};
