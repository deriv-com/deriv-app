#!/usr/bin/env node

/* eslint-disable no-console */
require('babel-register')({
    plugins: [
        'babel-plugin-transform-es2015-modules-commonjs',
        'babel-plugin-transform-object-rest-spread',
    ],
    extensions: ['.jsx'],
    cache     : true,
});

const color   = require('cli-color');
const Spinner = require('cli-spinner').Spinner;
const program = require('commander');
const crc32   = require('crc-32').str;
const fs      = require('fs');
const glob    = require('glob');
const common  = require('./common');

program
    .version('0.1.0')
    .description('Build translation source.')
    .option('-v, --verbose', 'Displays the list of paths to be compiled')
    .parse(process.argv);

/** *********************************************
 * Common functions
 */

const globs = ['**/*.js', '**/*.jsx'];

const getKeyHash = (string) => crc32(string);

/** **********************************************
 * Compile
 */
(async () => {
    try {
        const message = common.messageStart('Parsing strings');
        const spinner = new Spinner(`${message} ${color.cyan('%s')}`);
        spinner.setSpinnerString(18);
        spinner.start();

        const file_paths = [];
        const messages = [];
        const i18n_marker = new RegExp(/i18n_default_text={?['|"](.*?)['|"]}?/g);
        const messages_json = {};

        // Find all file types listed in `globs`
        for (let i = 0; i < globs.length; i++) {
            const filesFound = glob.sync(`src/${globs[i]}`);
            file_paths.push(...filesFound);
        }

        // Iterate over files and extract all strings from the i18n marker
        for (let i = 0; i < file_paths.length; i++) {
            try {
                const file = fs.readFileSync(file_paths[i], 'utf8');
                let result = i18n_marker.exec(file);
                while (result != null) {
                    messages.push(result[1]);
                    result = i18n_marker.exec(file);
                }
            } catch (e) {
                console.log(e);
            }
        }

        // Hash the messages and set the key-value pair for json
        for (let i = 0; i < messages.length; i++) {
            messages_json[getKeyHash(messages[i])] = messages[i];
        }

        // Add to messages.json
        fs.writeFileSync(
            'src/translations/messages.json',
            JSON.stringify(messages_json),
            'utf8',
            (err) => console.log(err)
        );

        spinner.stop();
    } catch (e) {
        console.error(e);
    }
})();
