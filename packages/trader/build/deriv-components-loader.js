// import { Button } from 'deriv-components';
//  ↓ ↓ ↓
// import Button from 'deriv-components/lib/button';
// import 'deriv-components/lib/button.css';
module.exports = function(source) {
    const lines  = source.split(/\n/);
    const mapped_lines = lines.map(line => {
        const matches = /\s*import\s+\{(.*)\}\s*from\s+\'deriv-components/.exec(line);
        if (!matches || !matches[1]) {
            return line; // do nothing;
        }
        const components = matches[1].replace(/\s+/g, '').split(',');
        const replace = components.map(c => `
import ${c} from 'deriv-components/lib/${c.toLocaleLowerCase()}';
import 'deriv-components/lib/${c.toLocaleLowerCase()}.css';
        `).join('\n');

        console.warn(replace);
        return replace;
    });
    return mapped_lines.join('\n');
}