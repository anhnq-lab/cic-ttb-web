const supabase = require('../supabase');
const fs = require('fs');
const path = require('path');

async function seed() {
    const dataPath = path.join(__dirname, '../seeds/projects.json');
    if (!fs.existsSync(dataPath)) {
        console.error('Projects data file not found at:', dataPath);
        return;
    }

    const projects = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    console.log(`Found ${projects.length} projects to import...`);

    for (const p of projects) {
        // Map fields to DB Schema (db_schema.sql)
        const dbRecord = {
            name: p.title,
            investor: p.client,
            location: p.location,
            description: p.scope_of_work + (p.description ? `\n\n${p.description}` : ''),
            // Combining scope and description into description, or separating if possible.
            // db_schema has 'area', check if p.description contains area.
            area: p.description && p.description.includes('Diện tích:') ? p.description.replace('Diện tích:', '').trim() : null,
            type: p.service_type,
            endDate: p.completion_date,
            status: p.status,
            // default progress?
            progress: 100
        };

        // Check if exists by name
        const { data: existing, error: searchError } = await supabase
            .from('projects')
            .select('id')
            .eq('name', dbRecord.name)
            .maybeSingle();

        if (searchError) {
            console.error(`Error checking existence of ${dbRecord.name}:`, searchError.message);
            continue;
        }

        if (existing) {
            console.log(`Updating: ${dbRecord.name}`);
            const { error } = await supabase
                .from('projects')
                .update(dbRecord)
                .eq('id', existing.id);
            if (error) console.error(`Error updating ${dbRecord.name}:`, error.message);
        } else {
            console.log(`Inserting: ${dbRecord.name}`);
            const { error } = await supabase
                .from('projects')
                .insert([dbRecord]);
            if (error) console.error(`Error inserting ${dbRecord.name}:`, error.message);
        }
    }
    console.log('Import complete.');
}

seed().then(() => process.exit(0));
