import supabase from '../supabase.js';

const getAllPricing = async (req, res) => {
    const { data, error } = await supabase
        .from('pricing')
        .select('*');

    if (error) return res.status(500).json({ error: error.message });

    const parsedRows = data.map(r => ({
        ...r,
        features: r.features ? JSON.parse(r.features) : []
    }));
    res.json(parsedRows);
};

const updatePricing = async (req, res) => {
    const { name, price, period, description, features, ctaText, isPopular } = req.body;
    const featuresStr = JSON.stringify(features);

    const { data, error } = await supabase
        .from('pricing')
        .update({
            name, price, period, description, features: featuresStr, cta_text: ctaText, is_popular: isPopular ? 1 : 0
        })
        .eq('id', req.params.id)
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
};

export {
    getAllPricing,
    updatePricing
};
