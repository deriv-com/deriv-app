const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs');
const render = require('./src/_utils/test_template');

(async () => {
    const args = process.argv.slice(2);
    if (args.length !== 2) {
        throw new Error('Insufficient args. Please use node e2e_tests/create_test.js category_name test_name');
    }
    const test_name = `[${args[0]}]-${args[1]}`;

    exec("git rev-parse --show-toplevel", (err, stdout) =>  {
        if (err) throw err;

        const project_root = stdout.trim();
        const file_name = `e2e_tests/src/__tests__/${args[0]}/${args[1]}.test.js`;
        const content = render(test_name);
        const target_dir = path.dirname(path.resolve(project_root, file_name));

        fs.mkdirSync(target_dir, { recursive: true });
        fs.writeFile(`${project_root}/${file_name}`, content, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    });
})();

