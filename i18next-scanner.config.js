const fs = require('fs');
const sha1 = require('sha1');

module.exports = {
    input: [
        'src/**/*.{js,jsx}',
        // Use ! to filter out files or directories
        '!src/**/*.spec.{js,jsx}',
        '!src/i18n/**',
        '!**/node_modules/**',
    ],
    output: './src/translations',
    transform: function customTransform(file, enc, done) {
        const { parser } = this;
        const content = fs.readFileSync(file.path, enc);

        parser.parseFuncFromString(content, { list: ['translate'] }, key => {
            const value = key;
            const default_key = sha1(key);
            parser.set(default_key, value);
        });

        parser.parseAttrFromString(content, { list: ['data-i18n-text', 'i18n-text', 'data-i18n-title'] }, key => {
            const value = key;
            const default_key = sha1(key);
            parser.set(default_key, value);
        });
        done();
    },
};
