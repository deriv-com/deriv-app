import { getNormalizedPaymentMethod, normalizePaymentMethods } from '../getPAListWithNormalizedPaymentMethods';

describe('getNormalizedPaymentMethod', () => {
    it('should normalize "ABSA Cash Send" to proper payment methods', () => {
        const result = getNormalizedPaymentMethod('ABSA Cash Send');

        expect(result).toEqual(['ABSA Bank', 'Cash send ABSA bank']);
    });

    it('should normalize "Direct deposit FNB and ABSA" to proper payment methods', () => {
        const result = getNormalizedPaymentMethod('Direct deposit FNB and ABSA');

        expect(result).toEqual(['ABSA Bank', 'Bank transfer', 'First National Bank (FNB)']);
    });

    it('should normalize "GPay" to proper payment method', () => {
        const result = getNormalizedPaymentMethod('GPay');

        expect(result).toEqual(['Google Pay']);
    });

    it('should return the same method that was provided', () => {
        const result = getNormalizedPaymentMethod('mocked payment method');

        expect(result).toEqual(['mocked payment method']);
    });
});

describe('normalizePaymentMethods', () => {
    const paymentMethods = [
        { payment_method: 'Direct deposit FNB and ABSA' },
        { payment_method: 'GPay' },
        { payment_method: 'Mastercard' },
        { payment_method: 'Visa' },
        { payment_method: 'M-Pesa Tigo-Pesa T-Pesa' },
        { payment_method: 'Mpesa' },
    ];

    it('should normalize payment methods into array without duplications', () => {
        const result = normalizePaymentMethods(paymentMethods);

        expect(result.length).toBe(8);
        expect(result).toEqual(
            expect.arrayContaining([
                { payment_method: 'ABSA Bank' },
                { payment_method: 'Bank transfer' },
                { payment_method: 'First National Bank (FNB)' },
                { payment_method: 'Google Pay' },
                { payment_method: 'Card' },
                { payment_method: 'M-PESA' },
                { payment_method: 'Tigo Pesa' },
                { payment_method: 'T-pesa' },
            ])
        );
    });
});
