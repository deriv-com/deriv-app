import crypto from 'crypto';
import { cryptoMathRandom } from '../index';

Object.defineProperty(globalThis, 'crypto', {
    value: {
        getRandomValues: (arr: Uint8Array) => crypto.randomBytes(arr.length),
    },
});

describe('cryptoMathRandom', () => {
    it('should return a number between 0 and 1', () => {
        const random_number = cryptoMathRandom();
        expect(random_number).toBeGreaterThanOrEqual(0);
        expect(random_number).toBeLessThanOrEqual(1);
    });
});
