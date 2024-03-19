import { isServerError } from '../utils';

describe('isServerError', () => {
    it('should return true if error object has code property', () => {
        const result = isServerError({ code: 'error code' });

        expect(result).toBe(true);
    });

    it('should return false if error is null', () => {
        const result = isServerError(null);

        expect(result).toBe(false);
    });

    it('should return false if error is not an object', () => {
        const errors = ['string', 10, true, false, []];

        errors.forEach(error => {
            const result = isServerError(error);

            expect(result).toBe(false);
        });
    });
});
