import { validAddress } from '../declarative-validation-rules';
import { expect } from '@jest/globals';

describe('validAddress', () => {
    it('should not accept empty string', () => {
        expect(validAddress('')).toBe(false);
    });
    it('should not accept string longer than 70 characters', () => {
        expect(validAddress('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod')).toBe(false);
    });
    it('should accept English and decimals', () => {
        expect(validAddress('221B Baker Street')).toBe(true);
    });
    it('should accept permitted characters', () => {
        expect(validAddress(". , ' : ; ( ) ° @ # / -")).toBe(true);
    });
    it('should accept different languages', () => {
        expect(validAddress('Улица đường phố ถนน شارع 街道 거리')).toBe(true);
    });
    it('should not accept specials characters other then the permitted ones', () => {
        const not_permitted_characters = '§±!$%^&*+=\\?{}[]|';
        [...not_permitted_characters].forEach(c => expect(validAddress(c)).toBe(false));
    });
});
