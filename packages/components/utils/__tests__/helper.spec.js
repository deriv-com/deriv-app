const { getEnglishCharacters } = require('../helper');

describe('Utility/Helper', () => {
    it('should return english alphabets removing special characters', () => {
        const test_input = 'Ai Cập';
        const test_result = 'Ai Cap';

        expect(getEnglishCharacters(test_input)).toMatch(test_result);
    });

    it('should return empty string if the text contains no english characters', () => {
        const test_input = '埃及';
        const test_result = '';

        expect(getEnglishCharacters(test_input)).toMatch(test_result);
    });
});
