import getAccountsFromLocalStorage from '../getAccountsFromLocalStorage';

describe('getAccountsFromLocalStorage', () => {
    beforeEach(() => {
        localStorage.clear();

        localStorage.setItem(
            'client.accounts',
            JSON.stringify({
                CR1001: {
                    token: '12345',
                },
            })
        );
    });

    test('should return object with one account', () => {
        const result = getAccountsFromLocalStorage();

        expect(result).toMatchObject({
            CR1001: {
                token: '12345',
            },
        });
    });

    test('should return empty object', () => {
        localStorage.clear();

        const result = getAccountsFromLocalStorage();

        expect(result).toBeUndefined();
    });
});
