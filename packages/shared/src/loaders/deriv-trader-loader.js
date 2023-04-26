const resolve = require('path').resolve;
const existsSync = require('fs').existsSync;
/* Using this loader you can import components from @deriv/trader without having to manually
import the corresponding stylesheet. The deriv-account-loader will automatically import
stylesheets.

    import { CFDStore } from '@deriv/trader';
    ↓ ↓ ↓
    import CFDStore from '@deriv/trader/dist/js/CFDStore';
*/

function checkExists(component) {
    return existsSync(resolve(__dirname, '../../../trader/src/Components/', component, `${component}.scss`));
}

module.exports = function (source, map) {
    const lines = source.split(/\n/);
    const mapped_lines = lines.map(line => {
        const matches = /\s*import\s+\{(.*)\}\s*from\s+\'@deriv\/trader/.exec(line); // eslint-disable-line no-useless-escape
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
import ${c} from '@deriv/trader/dist/trader/js/${c}';
${checkExists(c) ? `import '@deriv/trader/dist/trader/css/${c}.css';` : ''}
        `
            )
            .join('\n');

        return replace;
    });

    return this.callback(null, mapped_lines.join('\n'), map);
};
