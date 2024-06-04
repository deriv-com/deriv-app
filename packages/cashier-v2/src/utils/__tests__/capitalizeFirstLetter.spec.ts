import { capitalizeFirstLetter } from '../utils';

describe('capitalizeFirstLetter', () => {
    it('should capitalize first letter', () => {
        const result = capitalizeFirstLetter('hello world');

        expect(result).toBe('Hello world');
    });
});
