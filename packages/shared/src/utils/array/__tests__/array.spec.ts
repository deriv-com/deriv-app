import { shuffleArray } from '../array';

describe('shuffleArray', () => {
    it('shuffleArray should return same shuffled array', () => {
        const arrayEquals = (a: any[], b: any[]) => JSON.stringify(a) === JSON.stringify(b);

        const not_shuffled_test_array = [3, 5, 8, 0];
        const test_array = [3, 5, 8, 0];

        expect(arrayEquals(not_shuffled_test_array, test_array)).toBeTruthy();

        const shuffled_test_array = shuffleArray(test_array);

        expect(arrayEquals(not_shuffled_test_array, shuffled_test_array)).toBeFalsy();
        expect(arrayEquals(shuffled_test_array, test_array)).toBeTruthy();
    });
});
