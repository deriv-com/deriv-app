/**
 * A function that counts the number of decimal places in a number.
 * @param {Number | String} value - The number to count the decimal places of.
 * @returns {Number} The number of decimal places in the number.
 */
export const countDecimalPlaces = (value: number | string): number => (value.toString().split('.')?.[1] ?? '').length;

/**
 * A function that generates a colour from a nickname.
 *
 * @deprecated This will be removed once design has provided the correct colour for the user avatar.
 * @param {String} nickname - The nickname to generate a colour from.
 * @returns {String} A colour derived from nickname that is in our colours array.
 */
export const generateHexColourFromNickname = (nickname: string): string => {
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
        // Below we get a random colour from the string which is explained here: https://gist.github.com/0x263b/2bdd90886c2036a1ad5bcf06d6e6fb37
        const char_hash = nickname.charCodeAt(idx) + ((hash << 5) - hash); // eslint-disable-line no-bitwise
        return char_hash & char_hash; // eslint-disable-line no-bitwise
    }, 0);

    return colours[((colour_hash % colours.length) + colours.length) % colours.length];
};

/**
 * A function that gets the short nickname from a nickname.
 *
 * @param {String} nickname - The nickname to get the short nickname from.
 * @returns {String} The short nickname.
 */
export const getShortNickname = (nickname: string): string => nickname?.substring(0, 2).toUpperCase();
