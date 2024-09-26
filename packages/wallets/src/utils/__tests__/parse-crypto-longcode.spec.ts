import parseCryptoLongcode from '../parse-crypto-longcode';

describe('parseCryptoLongcode', () => {
    it('correctly parses a valid long code', () => {
        const longCode =
            'address: abc123def456ghi789jkl012mno345pqr678stu9, transaction: xyz123abc456def789ghi012jkl345mno678pqr901';
        const result = parseCryptoLongcode(longCode);

        expect(result).toEqual({
            addressHash: 'abc123def456ghi789jkl012mno345pqr678stu9',
            blockchainHash: 'xyz123abc456def789ghi012jkl345mno678pqr901',
            splitLongcode: [
                'address: abc123def456ghi789jkl012mno345pqr678stu9',
                'transaction: xyz123abc456def789ghi012jkl345mno678pqr901',
            ],
        });
    });

    it('handles missing address hash gracefully', () => {
        const longCode = 'address:, transaction: xyz123abc456def789ghi012jkl345mno678pqr901';
        const result = parseCryptoLongcode(longCode);

        expect(result).toEqual({
            addressHash: undefined,
            blockchainHash: 'xyz123abc456def789ghi012jkl345mno678pqr901',
            splitLongcode: ['address:', 'transaction: xyz123abc456def789ghi012jkl345mno678pqr901'],
        });
    });

    it('handles missing blockchain hash gracefully', () => {
        const longCode = 'address: abc123def456ghi789jkl012mno345pqr678stu9, transaction:';
        const result = parseCryptoLongcode(longCode);

        expect(result).toEqual({
            addressHash: 'abc123def456ghi789jkl012mno345pqr678stu9',
            blockchainHash: undefined,
            splitLongcode: ['address: abc123def456ghi789jkl012mno345pqr678stu9', 'transaction:'],
        });
    });

    it('handles a completely malformed code gracefully', () => {
        const longCode = 'malformed code without hashes';
        const result = parseCryptoLongcode(longCode);

        expect(result).toEqual({
            addressHash: undefined,
            blockchainHash: undefined,
            splitLongcode: ['malformed code without hashes'],
        });
    });

    it('works when an empty string is passed', () => {
        const longCode = '';
        const result = parseCryptoLongcode(longCode);

        expect(result).toEqual({
            addressHash: undefined,
            blockchainHash: undefined,
            splitLongcode: [''],
        });
    });
});
