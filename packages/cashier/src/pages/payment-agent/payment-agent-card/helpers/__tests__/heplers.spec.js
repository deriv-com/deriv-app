import { hasNormalizedPaymentMethods, getNormalizedPaymentMethod } from '../helpers';

describe('Heplers', () => {
    it('should normalize payment methods', () => {
        expect(getNormalizedPaymentMethod('E-WALLET')).toBe('Ewallet');
        expect(getNormalizedPaymentMethod('Bank Wire Transfer')).toBe('BankTransfer');
        expect(getNormalizedPaymentMethod('Localbank Transfer')).toBe('BankTransfer');
        expect(getNormalizedPaymentMethod('crypto-currencies')).toBe('Crypto');
        expect(getNormalizedPaymentMethod('WeAcceptCrypto')).toBe('Crypto');
        expect(getNormalizedPaymentMethod('Fake method')).toBe('');
    });

    it('should properly evaluate normalized payment methods', () => {
        expect(
            hasNormalizedPaymentMethods([
                { payment_method: 'E-WALLET' },
                { payment_method: 'Localbank Transfer' },
                { payment_method: 'Fake method' },
            ])
        ).toBeTruthy();

        expect(
            hasNormalizedPaymentMethods([
                { payment_method: 'Fake method' },
                { payment_method: 'Fake method' },
                { payment_method: 'Fake method' },
            ])
        ).toBeFalsy();

        expect(hasNormalizedPaymentMethods([])).toBeFalsy();
    });
});
