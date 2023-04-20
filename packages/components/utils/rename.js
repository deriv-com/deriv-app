/**
 * Rename all files in a directory (https://gist.github.com/scriptex/20536d8cda36221f91d69a6bd4a528b3)
 * Usage: node rename.js path/to/directory 'string-to-search' 'string-to-replace'
 */

const { join } = require('path');
const { readdirSync, renameSync } = require('fs');

const escapeStringRegExp = str => {
    const matchOperatorsRegex = /[|\\{}()[\]^$+*?.-]/g;

    if (typeof str !== 'string') {
        throw new TypeError('Expected a string');
    }

    return str.replace(matchOperatorsRegex, '\\$&');
};

const [dir, search, replace] = process.argv.slice(2);
const match = RegExp(escapeStringRegExp(search), 'g');
const files = readdirSync(dir);

files
    .filter(file => file.match(match))
    .forEach(file => {
        const filePath = join(dir, file);
        const newFilePath = join(dir, file.replace(match, replace));

        renameSync(filePath, newFilePath);
    });
