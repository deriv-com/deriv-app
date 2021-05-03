export const toTitleCase = str =>
    (str || '').replace(/\w[^\s/\\]*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

export const padLeft = (txt, len, char) => {
    const text = String(txt || '');
    return text.length >= len ? text : `${Array(len - text.length + 1).join(char)}${text}`;
};

export const compareBigUnsignedInt = (a, b) => {
    let first_num = numberToString(a);
    let second_num = numberToString(b);
    if (!first_num || !second_num) {
        return '';
    }
    const max_length = Math.max(first_num.length, second_num.length);
    first_num = padLeft(first_num, max_length, '0');
    second_num = padLeft(second_num, max_length, '0');

    // lexicographical comparison
    let order = 0;
    if (first_num !== second_num) {
        order = first_num > second_num ? 1 : -1;
    }

    return order;
};

export const matchStringByChar = (s, p) => {
    if (p?.length < 1) return true;
    const z = p.split('').reduce((a, b) => `${a}[^${b}]*${b}`);
    return RegExp(z, 'i').test(s);
};

export const numberToString = n => (typeof n === 'number' ? String(n) : n);

export const getKebabCase = str => {
    if (!str) return str;
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // get all lowercase letters that are near to uppercase ones
        .replace(/[\s]+/g, '-') // replace all spaces and low dash
        .toLowerCase();
};
