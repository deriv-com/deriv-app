const fs = require('fs');
const path = require('path');
const axios = require('axios');

(() => {
    const blocklyLanguages = ['en', 'it', 'vi', 'pl', 'ru', 'pt', 'es', 'fr', 'zh-hans', 'zh-hant'];

    if (!fs.existsSync(path.resolve('blockly-translations'))) {
        fs.mkdirSync(path.resolve('blockly-translations'));
    }
    return Promise.all(
        blocklyLanguages.map(lang => {
            const url = `https://blockly-demo.appspot.com/static/build/msg/${lang}.js?_=${Date.now()}`;

            return axios.get(url).then(({ data }) => {
                const filePath = path.resolve('blockly-translations', `${lang}.js`);
                return fs.writeFile(filePath, data, err => {
                    if (err) {
                        // eslint-disable-next-line no-console
                        console.log('something went wrong:', err);
                    }
                });
            });
        })
    );
})()
    .then(() => {
        // eslint-disable-next-line no-console
        console.log('\x1b[32m%s\x1b[0m', 'Blockly translations pulled successfully \u{1F44D}');
    })
    .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Error pulling Blockly translations:', error);
    });

(async () => {
    const outputPath = path.resolve('temp');
    const fileName = 'blockly.js';
    const filesToConcat = [
        './node_modules/blockly/blockly_compressed.js',
        './node_modules/blockly/blocks_compressed.js',
        './node_modules/blockly/javascript_compressed.js',
        './node_modules/blockly/msg/messages.js',
    ];

    // Read the content of each file
    const fileContents = await Promise.all(
        filesToConcat.map(async filePath => {
            const fileContent = await fs.promises.readFile(filePath, 'utf8');
            return `// File: ${path.basename(filePath)}\n${fileContent}\n`;
        })
    );

    // Concatenate the file contents
    const mergedContent = fileContents.join('\n');

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
    }
    // Create the output file
    const outputFile = path.join(outputPath, fileName);
    // eslint-disable-next-line no-console
    console.log(outputFile, 'output file');
    await fs.writeFile(outputFile, mergedContent, 'utf8', err => {
        // eslint-disable-next-line no-console
        console.log(err, 'Error fetching blockly');
    });
})()
    .then(() => {
        // eslint-disable-next-line no-console
        console.log('\x1b[32m%s\x1b[0m', 'Blockly pulled successfully \u{1F44D}');
    })
    .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Error pulling Blockly:', error);
    });
