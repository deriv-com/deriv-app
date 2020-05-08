export const toSentenceCase = string => {
    if (!string) {
        return '';
    }
    return string[0].toUpperCase() + string.slice(1);
};

export const countDecimalPlaces = value => {
    return ((value.toString().split('.') || [])[1] || []).length;
};

export const generateHexColourFromNickname = nickname => {
    const colours = ['#f43f83', 'var(--brand-secondary)', '#9ed178', 'var(--brand-orange)'];
    const colour_hash = nickname.split().reduce((hash, char, idx) => {
        /* eslint-disable no-bitwise */
        const char_hash = nickname.charCodeAt(idx) + ((hash << 5) - hash);
        return char_hash & char_hash;
        /* eslint-enable */
    }, 0);
    return colours[((colour_hash % colours.length) + colours.length) % colours.length];
};
