// Fix route imports to use namespace imports for controllers
import fs from 'fs';
import path from 'path';

const routesDir = './server/routes';
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));

files.forEach(file => {
    const filePath = path.join(routesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Change: import controller from '../controllers/xxx.js'
    // To:     import * as controller from '../controllers/xxx.js'
    const controllerPattern = /import (\w+) from '(\.\.\/controllers\/[^']+\.js)';/g;
    content = content.replace(controllerPattern, (match, varName, modPath) => {
        changed = true;
        return `import * as ${varName} from '${modPath}';`;
    });

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed controller import in: ${file}`);
    }
});

// Also check middleware/validation.js
const validationPath = './server/middleware/validation.js';
if (fs.existsSync(validationPath)) {
    let content = fs.readFileSync(validationPath, 'utf8');
    if (content.includes('require(')) {
        content = content.replace(/const (\w+) = require\(['"]([^'"]+)['"]\);?/g, (match, varName, modPath) => {
            if (modPath.startsWith('.') && !modPath.endsWith('.js')) {
                modPath = modPath + '.js';
            }
            return `import ${varName} from '${modPath}';`;
        });
        content = content.replace(/module\.exports = /g, 'export default ');
        fs.writeFileSync(validationPath, content, 'utf8');
        console.log('Fixed: validation.js');
    }
}

// Also check schemas
const schemasDir = './server/schemas';
if (fs.existsSync(schemasDir)) {
    const schemaFiles = fs.readdirSync(schemasDir).filter(f => f.endsWith('.js'));
    schemaFiles.forEach(file => {
        const filePath = path.join(schemasDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('require(')) {
            content = content.replace(/const (\w+) = require\(['"]([^'"]+)['"]\);?/g, (match, varName, modPath) => {
                return `import ${varName} from '${modPath}';`;
            });
            content = content.replace(/const \{ ([^}]+) \} = require\(['"]([^'"]+)['"]\);?/g, (match, vars, modPath) => {
                return `import { ${vars} } from '${modPath}';`;
            });
            content = content.replace(/module\.exports = /g, 'export ');
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Fixed: ${file}`);
        }
    });
}

console.log('Done!');
