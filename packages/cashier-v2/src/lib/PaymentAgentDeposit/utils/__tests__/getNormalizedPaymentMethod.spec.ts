import { getNormalizedPaymentMethod } from '../getNormalizedPaymentMethod';

describe('should normalize payment methods', () => {
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
