import { getNormalizedPaymentMethod } from '../helpers';

describe('Heplers', () => {
    it('should normalize payment methods', () => {
        expect(getNormalizedPaymentMethod('E-WALLET')).toBe('Ewallet');
        expect(getNormalizedPaymentMethod('Bank Wire Transfer')).toBe('BankTransfer');
        expect(getNormalizedPaymentMethod('Localbank Transfer')).toBe('BankTransfer');
        expect(getNormalizedPaymentMethod('crypto-currencies')).toBe('Crypto');
        expect(getNormalizedPaymentMethod('WeAcceptCrypto')).toBe('Crypto');
    });
});
