const crc32          = require('crc-32').str;
const fs             = require('fs');
const static_strings = require('./../../scripts/app-static-strings');

// Push static strings to list of messages to be added to JSON
const messages = [...static_strings];
const messages_json = {};

const getKeyHash = (string) => crc32(string);

const updateMessagesFile = () => {
    // Hash the messages and set the key-value pair for json
    messages.sort();
    for (let i = 0; i < messages.length; i++) {
        messages_json[getKeyHash(messages[i])] = messages[i];
    }

    // Add to messages.json
    fs.writeFileSync(
        'src/public/i18n/messages.json',
        JSON.stringify(messages_json),
        'utf8',
        (err) => console.log(err)
    );
};

module.exports = function(content, map, meta) {
    const i18n_marker = new RegExp(/i18n_default_text={?(?:(?<![\\])['"])(.*?)(?:(?<![\\])['"])}?|localize\((?:(?<![\\])['"])(.*?)(?:(?<![\\])['"])\)?/g);

    // Iterate over files and extract all strings from the i18n marker
    try {
        let result = i18n_marker.exec(content);
        while (result != null) {
            const extracted = result[1] || result[2]; // If it's index `1`, then it's the first capturing group, otherwise it's the 2nd, referring to `localize()` call
            messages.push(extracted.replace(/\\/g, ''));
            result = i18n_marker.exec(content);
        }
    } catch (e) {
        console.log(e);
    }

    updateMessagesFile();
    return content;
};
