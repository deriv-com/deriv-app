import getAccountName from '../getAccountName';

describe('getAccountName', () => {
    it('Should proper account name for demo trading account', () => {
        const name = getAccountName('trading', true, '');

        expect(name).toBe('Deriv Apps Demo');
    });

    it('Should proper account name for real trading account', () => {
        const name = getAccountName('trading', false, '');

        expect(name).toBe('Deriv Apps');
    });

    it('Should proper account name for demo wallet account', () => {
        const name = getAccountName('wallet', true, 'USD');

        expect(name).toBe('Demo USD Wallet');
    });

    it('Should proper account name for real wallet account', () => {
        const name = getAccountName('wallet', false, 'USD');

        expect(name).toBe('USD Wallet');
    });
});
