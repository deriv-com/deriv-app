import { shuffleArray } from '../array';
import crypto from 'crypto';
import { beforeAll } from '@jest/globals';

describe('shuffleArray', () => {
    beforeAll(() => {
        // using node.js randomBytes method here for simulating window.getRandomValues in shuffleArray function
        Object.defineProperty(global, 'crypto', {
            value: {
                getRandomValues: (arr: Uint32Array) => crypto.randomBytes(arr.length),
            },
        });
    });

    it('shuffleArray should return same shuffled array', () => {
        const arrayEquals = (a: number[], b: number[]) => JSON.stringify(a) === JSON.stringify(b);

        const not_shuffled_test_array = [1, 2, 3, 4];
        const test_array = [1, 2, 3, 4];

        expect(arrayEquals(not_shuffled_test_array, test_array)).toBeTruthy();

        const shuffled_test_array = shuffleArray(test_array);

        expect(arrayEquals(not_shuffled_test_array, shuffled_test_array)).toBeFalsy();
        expect(arrayEquals(shuffled_test_array, test_array)).toBeTruthy();
    });
});
