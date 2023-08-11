/**
 * Given 2 strings, it determines their relative ordering by comparing their lexicographical (dictionary) order.
 * It returns a numeric value
 *
 * 1: If string a is lexicographically greater than string b.
 * -1: If string b is lexicographically greater than string a.
 * 0: If both input strings a and b are lexicographically equal.
 * **/
const lexicographicalStringComparer = (a: string, b: string) => {
    if (a > b) {
        return 1;
    } else if (b > a) {
        return -1;
    }
    return 0;
};

export default lexicographicalStringComparer;
