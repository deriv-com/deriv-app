const fs = require('fs');
const path = require('path');
const axios = require('axios');

const blocklyLanguages = ['en', 'it', 'vi', 'pl', 'ru', 'pt', 'es', 'fr', 'zh-hans', 'zh-hant'];

function pullBlocklyTranslations() {
    if (!fs.existsSync(path.resolve('translations'))) {
        fs.mkdirSync(path.resolve('translations'));
    }
    return Promise.all(
        blocklyLanguages.map(lang => {
            const url = `https://blockly-demo.appspot.com/static/build/msg/${lang}.js?_=${Date.now()}`;

            return axios.get(url).then(({ data }) => {
                const filePath = path.resolve('translations', `${lang}.js`);
                return fs.writeFile(filePath, data, err => {
                    if (err) {
                        // eslint-disable-next-line no-console
                        console.log('something went wrong:', err);
                    }
                });
            });
        })
    );
}

pullBlocklyTranslations()
    .then(() => {
        // eslint-disable-next-line no-console
        console.log('\x1b[32m%s\x1b[0m', 'Blockly translations pulled successfully \u{1F44D}');
    })
    .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Error pulling Blockly translations:', error);
    });
