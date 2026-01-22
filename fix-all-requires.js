// Comprehensive script to fix ALL remaining require statements
import fs from 'fs';
import path from 'path';

const routesDir = './server/routes';

// Get all js files in routes
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));

files.forEach(file => {
    const filePath = path.join(routesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Replace ANY remaining require statements
    const requirePattern = /const (\w+) = require\(['"]([^'"]+)['"]\);?/g;
    content = content.replace(requirePattern, (match, varName, modPath) => {
        changed = true;
        // Add .js extension if it's a local import without extension
        if (modPath.startsWith('.') && !modPath.endsWith('.js')) {
            modPath = modPath + '.js';
        }
        return `import ${varName} from '${modPath}';`;
    });

    // Also handle destructured requires like const { x } = require(...)
    const destructuredPattern = /const \{ ([^}]+) \} = require\(['"]([^'"]+)['"]\);?/g;
    content = content.replace(destructuredPattern, (match, vars, modPath) => {
        changed = true;
        if (modPath.startsWith('.') && !modPath.endsWith('.js')) {
            modPath = modPath + '.js';
        }
        return `import { ${vars} } from '${modPath}';`;
    });

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed remaining requires in: ${file}`);
    }
});

console.log('Done fixing routes!');
