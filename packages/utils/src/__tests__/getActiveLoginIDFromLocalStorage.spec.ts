import getActiveLoginIDFromLocalStorage from '../getActiveLoginIDFromLocalStorage';

describe('getActiveLoginIDFromLocalStorage', () => {
    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem('active_loginid', 'CR1001');
    });

    test('should return active account token', () => {
        const result = getActiveLoginIDFromLocalStorage();

        expect(result).toBe('CR1001');
    });

    test('should return empty string', () => {
        localStorage.clear();

        const result = getActiveLoginIDFromLocalStorage();

        expect(result).toBe('');
    });
});
