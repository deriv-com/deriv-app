/* eslint-disable */
const fs = require('fs');
const readLine = require('readline');
const path = require('path');

const runIconNamesTest = async () => {
    const input = fs.createReadStream(path.resolve(__dirname, '../icons.js'));
    const rl = readLine.createInterface({ input, crlfDelay: Infinity });
    const regexp = /ic(-([A-Za-z0-9_]{2,})){1,}\.svg/;
    const errored_file_names = [];

    for await (const line of rl) {
        if (!/^import/.test(line)) {
            continue;
        } else if (!regexp.test(line)) {
            const file_name = line.split('/').pop();
            errored_file_names.push(file_name.substring(0, file_name.length - 2));
        }
    }

    if (errored_file_names.length > 0) {
        console.log("ERROR: Use more than one character for each section of an icon's name:");
        errored_file_names.forEach(file_name => console.log(`- ${file_name}`));
        console.log('If you have already updated the file name(s), please rebuild this package.');
        process.exit(1);
    } else {
        console.log('Success: Icon names look OK. ✓');
    }
};

runIconNamesTest();
