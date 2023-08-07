import compareStrings from '../compareStrings';

describe('compareStrings', () => {
    it('should return 1 if the first string is greater than the second string', () => {
        const result = compareStrings('b', 'a');
        expect(result).toBe(1);
    });
    it('should return -1 if the second string is greater than the first string', () => {
        const result = compareStrings('a', 'b');
        expect(result).toBe(-1);
    });
    it('should return 0 if both strings are equal', () => {
        const result = compareStrings('a', 'a');
        expect(result).toBe(0);
    });
});
