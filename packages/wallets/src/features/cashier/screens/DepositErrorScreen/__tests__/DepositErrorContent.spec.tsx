import getDepositErrorContent from '../DepositErrorContent';

describe('DepositErrorContent', () => {
    it('should render default content for title and description', () => {
        const result = getDepositErrorContent({
            cryptoConnectionError: false,
            currency: 'BTC',
            error: { code: 'Error', message: 'Error message' },
            suspendedCurrencyDeposit: false,
        });

        expect(result.title).toBeFalsy();
        expect(result.message).toBe('Error message');
        expect(result.buttonText).toBe('Try again');
    });

    it('should render correct content for suspendedCurrencyDeposit', () => {
        const result = getDepositErrorContent({
            cryptoConnectionError: false,
            currency: 'BTC',
            error: { code: 'suspendedCurrencyDeposit', message: 'Suspended Currency Deposit' },
            suspendedCurrencyDeposit: true,
        });

        expect(result.title).toBe('BTC Wallet deposits are temporarily unavailable');
        expect(result.message).toBe(
            'Due to system maintenance, deposits with your BTC Wallet are unavailable at the moment. Please try again later.'
        );
        expect(result.buttonText).toBeFalsy();
    });

    it('should render correct content for cryptoConnectionError', () => {
        const result = getDepositErrorContent({
            cryptoConnectionError: true,
            currency: 'BTC',
            error: { code: 'cryptoConnectionError', message: 'Crypto Connection Error' },
            suspendedCurrencyDeposit: false,
        });

        expect(result.title).toBe('Maintenance in progess');
        expect(result.message).toBe('Crypto Connection Error');
        expect(result.buttonText).toBeFalsy();
    });
});
