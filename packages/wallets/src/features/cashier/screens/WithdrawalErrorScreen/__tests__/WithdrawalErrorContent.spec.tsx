import getWithdrawalErrorContent from '../WithdrawalErrorContent';

describe('WithdrawalErrorContent', () => {
    it('should render default content for title and description', () => {
        const result = getWithdrawalErrorContent({
            cryptoConnectionError: false,
            cryptoInvalidAddress: false,
            currency: 'BTC',
            error: { code: 'Error', message: 'Error message' },
            invalidToken: false,
            resetError: () => null,
            setResendEmail: () => null,
            suspendedCurrencyWithdrawal: false,
        });

        expect(result.title).toBeFalsy();
        expect(result.message).toBe('Error message');
        expect(result.buttonText).toBe('Try again');
    });

    it('should render correct content for invalidToken', () => {
        const result = getWithdrawalErrorContent({
            cryptoConnectionError: false,
            cryptoInvalidAddress: false,
            currency: 'BTC',
            error: { code: 'invalidToken', message: 'Invalid Token' },
            invalidToken: true,
            resetError: () => null,
            setResendEmail: () => null,
            suspendedCurrencyWithdrawal: false,
        });

        expect(result.title).toBe('Email verification failed');
        expect(result.message).toBe(
            'The verification link you used is invalid or expired. Please request for a new one.'
        );
        expect(result.buttonText).toBe('Resend email');
    });

    it('should render correct content for cryptoInvalidAddress', () => {
        const result = getWithdrawalErrorContent({
            cryptoConnectionError: false,
            cryptoInvalidAddress: true,
            currency: 'BTC',
            error: { code: 'cryptoInvalidAddress', message: 'Crypto Invalid Address' },
            invalidToken: false,
            resetError: () => null,
            setResendEmail: () => null,
            suspendedCurrencyWithdrawal: false,
        });

        expect(result.title).toBe('Error');
        expect(result.message).toBe('Crypto Invalid Address');
        expect(result.buttonText).toBe('Try again');
    });

    it('should render correct content for suspendedCurrencyWithdrawal', () => {
        const result = getWithdrawalErrorContent({
            cryptoConnectionError: false,
            cryptoInvalidAddress: false,
            currency: 'BTC',
            error: { code: 'suspendedCurrencyWithdrawal', message: 'Suspended Currency Withdrawal' },
            invalidToken: false,
            resetError: () => null,
            setResendEmail: () => null,
            suspendedCurrencyWithdrawal: true,
        });

        expect(result.title).toBe('BTC Wallet withdrawals are temporarily unavailable');
        expect(result.message).toBe(
            'Due to system maintenance, withdrawals with your BTC Wallet are unavailable at the moment. Please try again later.'
        );
        expect(result.buttonText).toBeFalsy();
    });

    it('should render correct content for cryptoConnectionError', () => {
        const result = getWithdrawalErrorContent({
            cryptoConnectionError: true,
            cryptoInvalidAddress: false,
            currency: 'BTC',
            error: { code: 'cryptoConnectionError', message: 'Crypto Connection Error' },
            invalidToken: false,
            resetError: () => null,
            setResendEmail: () => null,
            suspendedCurrencyWithdrawal: false,
        });

        expect(result.title).toBe('Maintenance in progess');
        expect(result.message).toBe('Crypto Connection Error');
        expect(result.buttonText).toBeFalsy();
    });
});
