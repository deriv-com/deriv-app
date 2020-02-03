/**
 * Generate components/icon/icons.js & stories/icon/icons.js entries file automatically
 */

const { EOL } = require('os');
const path = require('path');
const fs = require('fs');

const entries_object = require('./icons.js');

function getPascalCase(str) {
    if (!str) return '';
    return (
        String(str)
            .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '$')
            .replace(/[^_A-Za-z0-9]+/g, '$')
            .replace(/([a-z])([A-Z])/g, (m, a, b) => `${a}$${b}`)
            // .toLowerCase()
            .replace(/(\$)(\w?)/g, (m, a, b) => b.toUpperCase())
    );
}

function buildIcons() {
    console.info('Build icons starting.');

    let modules = 0;

    const buffer = ['// auto-generated file. DO NOT MODIFY.', ''];

    const categories = {};
    const emitModule = file => {
        const pathname = entries_object[file].replace('.svg', '').replace('./src/components/icon/', '');
        const dirname = path.dirname(pathname);

        modules += 1;

        if (!categories[dirname]) {
            categories[dirname] = [];
        }
        const icon_name = getPascalCase(pathname.match(/([^/]*)\/*$/)[1].replace('.svg', ''));
        categories[dirname].push(icon_name);

        buffer.push(`import './${pathname}.svg';`);
    };

    const files = Object.keys(entries_object);
    files.forEach(f => {
        const stats = fs.statSync(entries_object[f]);
        if (stats.isFile()) {
            emitModule(f);
        }
    });

    fs.writeFileSync(
        path.join(__dirname, '../stories/icon/icons.js'),
        JSON.stringify(categories, null, 4)
            .replace(/"/g, "'")
            .replace(/^/, '// auto-generated file. DO NOT MODIFY.\n\nexport const icons =\n')
    );
    fs.writeFileSync(path.join(__dirname, '../src/components/icon/icons.js'), buffer.join(EOL) + EOL);

    console.info(`Build icons done. 'components/icon/icons.js' emitted with ${modules} modules.`);
}

module.exports.buildIcons = buildIcons;
