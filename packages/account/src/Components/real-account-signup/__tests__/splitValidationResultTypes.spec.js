import { type } from 'os';
import { object } from 'prop-types';
import React from 'react';
import { splitValidationResultTypes } from '../helpers/utils';

describe('splitValidationResultTypes', () => {
    it('should return object', () => {
        expect(typeof splitValidationResultTypes([[]])).toBe('object');
    });

    it('should return warnings object with Warning message inside and errors with empty object', () => {
        expect(splitValidationResultTypes([['warn', 'This is a warning message']])).toStrictEqual({
            errors: {},
            warnings: { 0: 'This is a warning message' },
        });
    });

    it('should return errors object with Error message inside and warnings with empty object', () => {
        expect(splitValidationResultTypes([['error', 'This is an error message']])).toStrictEqual({
            errors: { 0: 'This is an error message' },
            warnings: {},
        });
    });

    it('should return with both warnings and errors empty object', () => {
        expect(splitValidationResultTypes([[]])).toStrictEqual({ errors: {}, warnings: {} });
    });
});
