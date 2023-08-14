import getActiveToken from '../getActiveToken';

describe('getActiveToken', () => {
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
        localStorage.setItem('active_loginid', 'CR1001');
    });

    test('should return active account token', () => {
        const result = getActiveToken();

        expect(result).toBe('12345');
    });

    test('should return empty string', () => {
        localStorage.setItem('active_loginid', 'CR1111');

        const result = getActiveToken();

        expect(result).toBe('');
    });
});
