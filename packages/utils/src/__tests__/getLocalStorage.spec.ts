import { getLocalStorage } from '../getLocalStorage';

describe('getLocalStorage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('should retrieve the stored value from localStorage', () => {
        const key = 'test_key';
        const value = 'Hello';

        localStorage.setItem(key, JSON.stringify(value));

        const result = getLocalStorage(key);

        expect(result).toBe(value);
    });

    test('should return null when localStorage key does not exist', () => {
        const key = 'non_existent_key';

        const result = getLocalStorage(key);

        expect(result).toBeNull();
    });

    test('should return null when localStorage value is null', () => {
        const key = 'test_key';

        localStorage.setItem(key, JSON.stringify(null));

        const result = getLocalStorage(key);

        expect(result).toBeNull();
    });

    test('should parse and return the stored value as an object', () => {
        const key = 'test_key';
        const value = { name: 'John', age: 30 };

        localStorage.setItem(key, JSON.stringify(value));

        const result = getLocalStorage(key);

        expect(result).toEqual(value);
    });
});
