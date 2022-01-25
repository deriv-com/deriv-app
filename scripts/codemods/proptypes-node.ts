// eslint-disable-next-line import/no-extraneous-dependencies
import fg from 'fast-glob';
import fs from 'fs';
import child_process from 'child_process';
import util from 'util';

const exec = util.promisify(child_process.exec);
const rename = util.promisify(fs.rename);

const args = process.argv.slice(2);

const files = fg.sync(args);

async function processFiles() {
    // eslint-disable-next-line no-restricted-syntax
    for await (const file of files) {
        const new_file_name = file.replace('.jsx', '.tsx');

        console.log(`Processing file - ${file}`);

        await rename(file, new_file_name);
        const { stdout, stderr } = await exec(
            `jscodeshift -t ./scripts/codemods/proptypes.js ${new_file_name} --parser=tsx`
        );

        if (stdout.indexOf('ERR ') > -1 || stderr.indexOf('ERR ') > -1) {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        }
    }
}

processFiles();
