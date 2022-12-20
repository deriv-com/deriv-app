import { expect } from 'chai';
import { isButtonSelected } from '../helpers.js';

describe('ToggleButton:Helpers', () => {
    describe('isButtonSelected', () => {
        it('should return false when the value or the candidate is null', () => {
            expect(isButtonSelected(null, 'xyz')).be.false;
            expect(isButtonSelected([], null)).be.false;
        });

        it('should return true when the candidate is equal to the value', () => {
            expect(isButtonSelected('test', 'test')).be.true;
        });

        it('should return false when the candidate is not equal to the value', () => {
            expect(isButtonSelected('test', 'tesy')).be.false;
        });

        it('should return true when the value is an array and contains the candidate', () => {
            expect(isButtonSelected(['test-1', 'test-2'], 'test-1')).be.true;
        });

        it('should return false when the value is an array and does not contain the candidate', () => {
            expect(isButtonSelected(['test-1', 'test-2'], 'test-3')).be.false;
        });
    });
});
