import { splitValidationResultTypes } from '../utils';

describe('splitValidationResultTypes', () => {
    it('should return object', () => {
        expect(typeof splitValidationResultTypes([[]])).toBe('object');
    });

    it('should return warnings object with warning message inside and errors with empty object', () => {
        expect(splitValidationResultTypes([['warn', 'This is a warning message']])).toStrictEqual({
            errors: {},
            warnings: { 0: 'This is a warning message' },
        });
    });

    it('should return errors object with error message inside and warnings with empty object', () => {
        expect(splitValidationResultTypes([['error', 'This is an error message']])).toStrictEqual({
            errors: { 0: 'This is an error message' },
            warnings: {},
        });
    });

    it('should return with both warnings and errors empty object', () => {
        expect(splitValidationResultTypes([[]])).toStrictEqual({ errors: {}, warnings: {} });
    });
});
