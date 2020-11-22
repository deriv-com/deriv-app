const path = require('path');
const fs = require('fs');
const render = require('./src/_utils/test_template');

(async () => {
    const args = process.argv.slice(2);
    if (args.length !== 2) {
        throw new Error('Insufficient args. Please use node tests/create_test.js mobile|desktop test_name');
    }
    const test_name = `[${args[0]}]-${args[1]}`;
    const file_name = `tests/src/${args[0]}/${args[1]}.test.js`;
    const content = render(test_name);
    const target_dir = path.dirname(file_name);
    fs.mkdirSync(target_dir, { recursive: true });
    fs.writeFile(file_name, content, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
})();

