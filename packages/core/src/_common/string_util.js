const toTitleCase = str => (
    (str || '').replace(/\w[^\s/\\]*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
);

const padLeft = (txt, len, char) => {
    const text = String(txt || '');
    return text.length >= len ? text : `${Array((len - text.length) + 1).join(char)}${text}`;
};

const compareBigUnsignedInt = (a, b) => {
    let first_num  = numberToString(a);
    let second_num = numberToString(b);
    if (!first_num || !second_num) {
        return '';
    }
    const max_length = Math.max(first_num.length, second_num.length);
    first_num        = padLeft(first_num, max_length, '0');
    second_num       = padLeft(second_num, max_length, '0');

    // lexicographical comparison
    let order = 0;
    if (first_num !== second_num) {
        order = first_num > second_num ? 1 : -1;
    }

    return order;
};

const numberToString = n => (typeof n === 'number' ? String(n) : n);

module.exports = {
    toTitleCase,
    padLeft,
    numberToString,
    compareBigUnsignedInt,
};
