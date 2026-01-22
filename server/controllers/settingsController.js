import supabase from '../supabase.js';

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
        if (error) return res.status(500).json({ error: error.message });
        result = data;
    } else {
        // Insert new
        const { data, error } = await supabase
            .from('settings')
            .insert([{ key: 'general', value: settings }])
            .select()
            .single();
        if (error) return res.status(500).json({ error: error.message });
        result = data;
    }
    
    res.json(req.body);
};

export {
    getSettings,
    updateSettings
};
