import getTruncatedHashString from '../getTruncatedHashString';

describe('getTruncatedHashString', () => {
    test('should truncate the hash string', () => {
        const result = getTruncatedHashString('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');

        expect(result).toBe('eyJh....VCJ9');
    });
});
