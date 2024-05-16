import getDepositErrorContent from '../DepositErrorContent';

describe('DepositErrorContent', () => {
    it('should render default content for title and description', () => {
        const result = getDepositErrorContent({
            currency: 'BTC',
            error: { code: 'Error', message: 'Error message' },
        });

        expect(result.title).toBeFalsy();
        expect(result.message).toBe('Error message');
        expect(result.buttonText).toBe('Try again');
    });

    it('should render correct content for crypto suspended currency', () => {
        const result = getDepositErrorContent({
            currency: 'BTC',
            error: { code: 'CryptoSuspendedCurrency', message: 'Crypto Suspended Currency' },
        });

        expect(result.title).toBe('BTC Wallet deposits are temporarily unavailable');
        expect(result.message).toBe(
            'Due to system maintenance, deposits with your BTC Wallet are unavailable at the moment. Please try again later.'
        );
        expect(result.buttonText).toBeFalsy();
    });

    it('should render correct content for crypto suspended deposit', () => {
        const result = getDepositErrorContent({
            currency: 'BTC',
            error: { code: 'CryptoDisabledCurrencyDeposit', message: 'Crypto Suspended Deposit' },
        });

        expect(result.title).toBe('BTC Wallet deposits are temporarily unavailable');
        expect(result.message).toBe(
            'Due to system maintenance, deposits with your BTC Wallet are unavailable at the moment. Please try again later.'
        );
        expect(result.buttonText).toBeFalsy();
    });

    it('should render correct content for crypto connection error', () => {
        const result = getDepositErrorContent({
            currency: 'BTC',
            error: { code: 'CryptoConnectionError', message: 'Crypto Connection Error' },
        });

        expect(result.title).toBe('Maintenance in progess');
        expect(result.message).toBe('Crypto Connection Error');
        expect(result.buttonText).toBeFalsy();
    });
});
