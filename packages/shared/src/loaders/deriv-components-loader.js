/* Using this loader you can import components from deriv-components without having to manually
import the corresponding stylesheet. The deriv-components-loader will automatically import
stylesheets.

    // to import UI components
    import { Button } from 'deriv-components';
    ↓ ↓ ↓
    import Button from 'deriv-components/lib/button';
    import 'deriv-components/lib/button.css';

    // to import icon components
    import { IconClose } from 'deriv-components';
    ↓ ↓ ↓
    import IconClose from 'deriv-components/lib/icons/IconClose.jsx';
*/

module.exports = function(source, map) {
    const lines  = source.split(/\n/);
    const mapped_lines = lines.map(line => {
        const matches = /\s*import\s+\{(.*)\}\s*from\s+\'deriv-components/.exec(line); // eslint-disable-line no-useless-escape
        if (!matches || !matches[1]) {
            return line; // do nothing;
        }
        const components = matches[1].replace(/\s+/g, '').split(',');
        const replace = components.map(c => {
            // import icon components
            if (c.startsWith('Ic') || c.startsWith('Img')) {
return `import ${c} from 'deriv-components/lib/icons/${c}.jsx';`
            }
            // import UI components
            return `
import ${c} from 'deriv-components/lib/${c.toLocaleLowerCase()}';
import 'deriv-components/lib/${c.toLocaleLowerCase()}.css';
        `}).join('\n');

        return replace;
    });

    this.callback(null, mapped_lines.join('\n'), map);
};
