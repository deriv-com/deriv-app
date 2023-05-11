import crypto from 'crypto';
import { getRandom3DigitNumber } from '../proof-of-identity-utils';

Object.defineProperty(globalThis, 'crypto', {
    value: {
        getRandomValues: (arr: any) => crypto.randomBytes(arr.length),
    },
});

describe('getRandom3DigitNumber', () => {
    it('should return a number between 100 and 999', () => {
        const random_number = getRandom3DigitNumber();
        expect(random_number).toBeGreaterThanOrEqual(100);
        expect(random_number).toBeLessThanOrEqual(999);
    });
});
