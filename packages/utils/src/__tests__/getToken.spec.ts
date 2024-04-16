import getToken from '../getToken';

describe('getActiveAuthTokenIDFromLocalStorage', () => {
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

    test('should return specific account token', () => {
        const result = getToken('CR1001');

        expect(result).toBe('12345');
    });

    test('should return undefined for unrecognised account', () => {
        localStorage.setItem('active_loginid', 'CR1111');

        const result = getToken('UNKNWON_ACCOUNT');

        expect(result).toBeUndefined();
    });

    test('if local storage empty, retrun undefined', () => {
        localStorage.clear();

        const result = getToken('CR1001');

        expect(result).toBeUndefined();
    });
});
