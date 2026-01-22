import supabase from '../supabase.js';

const getAllContacts = async (req, res) => {
    const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};

const createContact = async (req, res) => {
    const { name, email, phone, service, note, company } = req.body;
    const { data, error } = await supabase
        .from('contacts')
        .insert([{ name, email, phone, service, note, company }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
};

const deleteContact = async (req, res) => {
    const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Deleted", id: req.params.id });
};

export {
    getAllContacts,
    createContact,
    deleteContact
};
