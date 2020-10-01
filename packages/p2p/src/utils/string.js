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
    if (!nickname) {
        return '??';
    }

    const colours = [
        '#fc4400',
        '#ff8c00',
        '#092694',
        '#527bb5',
        '#3f6fe5',
        '#6b4bb6',
        '#db69e1',
        '#ca0051',
        '#3f6fe5',
        '#f43f83',
        '#6aba8d',
        '#3fdce5',
        '#1fb8bf',
        '#9ed178',
        '#71bd0e',
        '#ff6444',
    ];
    const colour_hash = nickname.split().reduce((hash, char, idx) => {
        // https://gist.github.com/0x263b/2bdd90886c2036a1ad5bcf06d6e6fb37
        // string.charCodeAt(i) returns the UTF-16 code for the character at index i
        // Bit operators work on 32 bits numbers. Any numeric operand in the operation
        // is converted into a 32 bit number.
        // hash << 5 is equivalent to hash * Math.pow(2, 5) (hash * 32),
        // except the bit operator << makes sure our result is a 32 bit number.
        // hash & hash again, makes sure we only return a 32 bit number.
        const char_hash = nickname.charCodeAt(idx) + ((hash << 5) - hash); // eslint-disable-line no-bitwise
        return char_hash & char_hash; // eslint-disable-line no-bitwise
    }, 0);

    // Returns a colour derived from nickname that is in our colours array.
    return colours[((colour_hash % colours.length) + colours.length) % colours.length];
};

export const getShortNickname = nickname => nickname && nickname.substr(0, 2).toUpperCase();
