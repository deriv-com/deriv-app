/**
 * Given 2 strings, it determines if one is greater than the other or not.
 *
 * @param {string} a: first string
 * @param {string} b: second string
 *
 * @returns {number} - 1 if a is greater than b, -1 if b is greater than a, 0 if both are equal
 * **/
const compareStrings = (a: string, b: string) => {
    if (a > b) {
        return 1;
    } else if (b > a) {
        return -1;
    }
    return 0;
};

export default compareStrings;
