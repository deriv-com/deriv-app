const resolve = require('path').resolve;
const existsSync = require('fs').existsSync;
/* Using this loader you can import components from @deriv/components without having to manually
import the corresponding stylesheet. The deriv-reports-loader will automatically import
stylesheets.

    import { PoaExpired } from '@deriv/reports';
    ↓ ↓ ↓
    import PoaExpired from '@deriv/reports/dist/js/poa-expired';
*/

function getKebabCase(str) {
    return str
        .split(/(?=[A-Z])/)
        .join('-')
        .toLowerCase();
}

function checkExists(component) {
    return existsSync(resolve(__dirname, '../../../reports/src/Components/', component, `${component}.scss`));
}

module.exports = function (source, map) {
    const lines = source.split(/\n/);
    const mapped_lines = lines.map(line => {
        const matches = /\s*import\s+\{(.*)\}\s*from\s+\'@deriv\/reports/.exec(line); // eslint-disable-line no-useless-escape
        if (!matches || !matches[1]) {
            return line; // do nothing;
        }
        const components = matches[1]
            .replace(/\sas\s\w+/, '') // Remove aliasing from imports.
            .replace(/\s+/g, '')
            .split(',');
        const replace = components
            .map(
                c => `
import ${c} from '@deriv/reports/dist/reports/js/${getKebabCase(c)}';
${checkExists(getKebabCase(c)) ? `import '@deriv/reports/dist/reports/css/${getKebabCase(c)}.css';` : ''}
        `
            )
            .join('\n');

        return replace;
    });

    return this.callback(null, mapped_lines.join('\n'), map);
};
