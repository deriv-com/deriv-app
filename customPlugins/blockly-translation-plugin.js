const axios = require('axios');
const path = require('path');
const fs = require('fs');

class PullBlocklyTranslationsPlugin {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        compiler.hooks.afterEmit.tapAsync('PullBlocklyTranslationsPlugin', (compilation, callback) => {
            const blocklyLanguages = ['en', 'it', 'vi', 'pl', 'ru', 'pt', 'es', 'fr', 'zh-hans', 'zh-hant'];
            const baseDir = 'https://blockly-demo.appspot.com/static/build/msg/';

            Promise.all(
                blocklyLanguages.map(lang =>
                    axios.get(`${baseDir}${lang}.js?_=${Date.now()}`).then(response => ({
                        lang,
                        content: response.data,
                    }))
                )
            )
                .then(translations => {
                    if (!fs.existsSync(this.options.outputPath)) {
                        fs.mkdirSync(this.options.outputPath, { recursive: true });
                    }
                    translations.forEach(({ lang, content }) => {
                        const file_path = path.join(this.options.outputPath, `${lang}.js`);

                        fs.writeFile(file_path, content, err => {
                            if (err) {
                                // eslint-disable-next-line no-console
                                console.log('something went wrong:', err);
                            }
                        });
                    });
                    // eslint-disable-next-line no-console
                    console.log('\x1b[32m%s\x1b[0m', 'Blockly translations pulled successfully \u{1F44D}');
                    callback();
                })
                .catch(error => {
                    // eslint-disable-next-line no-console
                    console.error('Error fetching Blockly translations:', error);
                    callback();
                });
        });
    }
}

module.exports = PullBlocklyTranslationsPlugin;
