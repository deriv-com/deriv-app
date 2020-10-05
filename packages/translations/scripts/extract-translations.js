#!/usr/bin/env node

/* eslint-disable no-console */
const path = require('path');
const program = require('commander');
const crc32 = require('crc-32').str;
const fs = require('fs');
const static_strings = require('./app-static-strings');
const getStringsFromInput = require('./extract-string').getStringsFromInput;
const getStringsFromXmlFile = require('./extract-string').getStringsFromXmlFile;
const getTranslatableFiles = require('./extract-string').getTranslatableFiles;

program
    .version('0.1.0')
    .description('Build translation source.')
    .option('-v, --verbose', 'Displays the list of paths to be compiled')
    .parse(process.argv);

/** *********************************************
 * Common
 */
const getKeyHash = string => crc32(string);

/** **********************************************
 * Compile
 */
(async () => {
    try {
        const file_paths = getTranslatableFiles();
        const messages = [];
        const messages_json = {};

        // Iterate over files and extract all strings from the i18n marker
        for (let i = 0; i < file_paths.length; i++) {
            const file_path = file_paths[i];

            try {
                if (program.verbose) {
                    console.log(file_path);
                }

                const file = fs.readFileSync(file_path, 'utf8');
                messages.push(...(file_path.endsWith('xml') ? getStringsFromXmlFile(file) : getStringsFromInput(file)));
            } catch (e) {
                console.log(e);
            }
        }
        // Push static strings to list of messages to be added to JSON
        messages.push(...static_strings);

        // Hash the messages and set the key-value pair for json
        for (let i = 0; i < messages.length; i++) {
            messages_json[getKeyHash(messages[i])] = messages[i];
        }

        // Add to messages.json
        fs.writeFileSync(
            path.resolve(__dirname, '../crowdin/messages.json'),
            JSON.stringify(messages_json),
            'utf8',
            err => console.log(err)
        );
    } catch (e) {
        console.error(e);
    }
})();
