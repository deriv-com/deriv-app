const resolve = require('path').resolve;
const existsSync = require('fs').existsSync;

function checkExists(component) {
    return existsSync(resolve(__dirname, '../../../account-v2/src/lib/', component, `${component}.scss`));
}

module.exports = function (source, map) {
    const lines = source.split(/\n/);
    const mapped_lines = lines.map(line => {
        const matches = /\s*import\s+\{(.*)\}\s*from\s+\'@deriv\/account-v2/.exec(line); // eslint-disable-line no-useless-escape
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
import ${c} from '@deriv/account-v2/dist/account-v2/js/${c}';
${checkExists(c) ? `import '@deriv/account-v2/dist/account-v2/css/${c}.css';` : ''}
        `
            )
            .join('\n');

        return replace;
    });

    return this.callback(null, mapped_lines.join('\n'), map);
};
