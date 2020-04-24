const getStringsFromInput = (input) => {
    const i18n_marker = new RegExp(/i18n_default_text=(['"])(.*?)(?<!\\)\1|localize\(\s*(['"])\s*(.*?)\s*(?<!\\)\3\s*/gs);
    const messages = [];

    while ((result = i18n_marker.exec(input)) !== null) {
        // If it captures `text=` then it will be index 2, else its index 4 which captures `localize`
        const extracted = result[2] || result[4]
        // Replace escape characters.
        messages.push(extracted.replace(/\\/g, '')); 
    }

    return messages;
}

module.exports = {
    getStringsFromInput,
};
