import { getNormalizedIconPaymentMethod } from '../getNormalizedIconPaymentMethod';

describe('should normalize icon payment methods', () => {
    it('should normalize different spellings of "banktransfer" to "Bank"', () => {
        const paymentMethods = ['banktransfer', 'bank-transfer', 'bankt ransfer', "bank'transfer", 'bank,transfer'];

        paymentMethods.forEach(paymentMethod => {
            const result = getNormalizedIconPaymentMethod(paymentMethod);

            expect(result).toBe('Bank');
        });
    });

    it('should normalize different spellings of "ewallets" to "Bank"', () => {
        const paymentMethods = ['ewallets', 'ewalletpayment', 'ewallet-payment', 'ewallet payment', 'e-wallets'];

        paymentMethods.forEach(paymentMethod => {
            const result = getNormalizedIconPaymentMethod(paymentMethod);

            expect(result).toBe('Ewallet');
        });
    });

    it('should return empty string if there are no matches with provided payment method', () => {
        const result = getNormalizedIconPaymentMethod('non-existent payment method');

        expect(result).toBe('');
    });
});
