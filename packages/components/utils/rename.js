/**
 * Rename all files in a directory (https://gist.github.com/scriptex/20536d8cda36221f91d69a6bd4a528b3)
 * Usage: node rename.js path/to/directory 'string-to-search' 'string-to-replace'
 */

const { join } = require('path');
const { readdirSync, renameSync } = require('fs');

const [dir, search, replace] = process.argv.slice(2);
const match = RegExp(search, 'g');
const files = readdirSync(dir);

// Validate and sanitize the user-supplied input
const validateInput = input => {
    // Use a regex pattern to allow only valid characters in the input
    const validPattern = /^[a-zA-Z0-9\s]*$/;
    if (!validPattern.test(input)) {
        throw new Error('Invalid input');
    }
};

validateInput(search);
validateInput(replace);

files
    .filter(file => file.match(match))
    .forEach(file => {
        const filePath = join(dir, file);
        const newFilePath = join(dir, file.replace(match, replace));

        renameSync(filePath, newFilePath);
    });
