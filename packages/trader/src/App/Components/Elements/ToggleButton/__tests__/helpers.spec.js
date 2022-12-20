import { isButtonSelected } from '../helpers.js';

describe('ToggleButton:Helpers', () => {
    describe('isButtonSelected', () => {
        it('should return false when the value or the candidate is null', () => {
            expect(isButtonSelected(null, 'xyz')).toBe(false);
            expect(isButtonSelected([], null)).toBe(false);
        });

        it('should return true when the candidate is equal to the value', () => {
            expect(isButtonSelected('test', 'test')).toBe(true);
        });

        it('should return false when the candidate is not equal to the value', () => {
            expect(isButtonSelected('test', 'tesy')).toBe(false);
        });

        it('should return true when the value is an array and contains the candidate', () => {
            expect(isButtonSelected(['test-1', 'test-2'], 'test-1')).toBe(true);
        });

        it('should return false when the value is an array and does not contain the candidate', () => {
            expect(isButtonSelected(['test-1', 'test-2'], 'test-3')).toBe(false);
        });
    });
});
