import { getSupportedPaymentMethods } from '../getSupportedPaymentMethods';

describe('should combine all payment methods', () => {
    const paymentAgentList = [
        { supported_payment_methods: [{ payment_method: 'ABSA Cash Send' }, { payment_method: 'GPay' }] },
        {
            supported_payment_methods: [
                { payment_method: 'ABSA Cash Send' },
                { payment_method: 'GPay' },
                { payment_method: 'Visa' },
            ],
        },
        {
            supported_payment_methods: [
                { payment_method: 'Mastercard' },
                { payment_method: 'Visa' },
                { payment_method: 'My payment method' },
            ],
        },
        {
            supported_payment_methods: [],
        },
    ];

    it('should normalize, combine and sort all payment methods into an array without duplications', () => {
        //@ts-expect-error since this is a mock, we only need partial properties of payment agent
        const result = getSupportedPaymentMethods(paymentAgentList);

        expect(result).toEqual(['ABSA Bank', 'Card', 'Cash send ABSA bank', 'Google Pay', 'My payment method']);
    });
});
