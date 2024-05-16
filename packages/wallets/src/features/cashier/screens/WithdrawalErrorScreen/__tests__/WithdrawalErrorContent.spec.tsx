import getWithdrawalErrorContent from '../WithdrawalErrorContent';

describe('WithdrawalErrorContent', () => {
    it('should render default content for title and description', () => {
        const result = getWithdrawalErrorContent({
            currency: 'BTC',
            error: { code: 'Error', message: 'Error message' },
            resetError: () => null,
            setResendEmail: () => null,
        });

        expect(result.title).toBeFalsy();
        expect(result.message).toBe('Error message');
        expect(result.buttonText).toBe('Try again');
    });

    it('should render correct content for invalid token', () => {
        const result = getWithdrawalErrorContent({
            currency: 'BTC',
            error: { code: 'InvalidToken', message: 'Invalid Token' },
            resetError: () => null,
            setResendEmail: () => null,
        });

        expect(result.title).toBe('Email verification failed');
        expect(result.message).toBe(
            'The verification link you used is invalid or expired. Please request for a new one.'
        );
        expect(result.buttonText).toBe('Resend email');
    });

    it('should render correct content for crypto invalid address', () => {
        const result = getWithdrawalErrorContent({
            currency: 'BTC',
            error: { code: 'CryptoInvalidAddress', message: 'Crypto Invalid Address' },
            resetError: () => null,
            setResendEmail: () => null,
        });

        expect(result.title).toBe('Error');
        expect(result.message).toBe('Crypto Invalid Address');
        expect(result.buttonText).toBe('Try again');
    });

    it('should render correct content for crypto suspended currency', () => {
        const result = getWithdrawalErrorContent({
            currency: 'BTC',
            error: { code: 'CryptoSuspendedCurrency', message: 'Crypto Suspended Currency' },
            resetError: () => null,
            setResendEmail: () => null,
        });

        expect(result.title).toBe('BTC Wallet withdrawals are temporarily unavailable');
        expect(result.message).toBe(
            'Due to system maintenance, withdrawals with your BTC Wallet are unavailable at the moment. Please try again later.'
        );
        expect(result.buttonText).toBeFalsy();
    });

    it('should render correct content for crypto suspended withdrawal', () => {
        const result = getWithdrawalErrorContent({
            currency: 'BTC',
            error: { code: 'CryptoDisabledCurrencyWithdrawal', message: 'Crypto Suspended Withdrawal' },
            resetError: () => null,
            setResendEmail: () => null,
        });

        expect(result.title).toBe('BTC Wallet withdrawals are temporarily unavailable');
        expect(result.message).toBe(
            'Due to system maintenance, withdrawals with your BTC Wallet are unavailable at the moment. Please try again later.'
        );
        expect(result.buttonText).toBeFalsy();
    });

    it('should render correct content for crypto connection error', () => {
        const result = getWithdrawalErrorContent({
            currency: 'BTC',
            error: { code: 'CryptoConnectionError', message: 'Crypto Connection Error' },
            resetError: () => null,
            setResendEmail: () => null,
        });

        expect(result.title).toBe('Maintenance in progess');
        expect(result.message).toBe('Crypto Connection Error');
        expect(result.buttonText).toBeFalsy();
    });
});
