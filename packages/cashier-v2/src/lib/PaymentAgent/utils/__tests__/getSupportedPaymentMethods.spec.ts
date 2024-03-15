import { getSupportedPaymentMethods } from '../getSupportedPaymentMethods';

describe('should combine all payment methods', () => {
    const paymentAgentList = [
        { supported_payment_methods: [{ payment_method: 'ABSA Bank' }, { payment_method: 'E-wallet' }] },
        {
            supported_payment_methods: [
                { payment_method: 'Finbank' },
                { payment_method: 'ABSA Bank' },
                { payment_method: 'Card' },
            ],
        },
        {
            supported_payment_methods: [
                { payment_method: 'Crypto' },
                { payment_method: 'Card' },
                { payment_method: 'My payment method' },
            ],
        },
        {
            supported_payment_methods: [],
        },
    ];

    it('should combine and sort all payment methods into an array without duplications', () => {
        //@ts-expect-error since this is a mock, we only need partial properties of payment agent
        const result = getSupportedPaymentMethods(paymentAgentList);

        expect(result).toEqual(['ABSA Bank', 'Card', 'Crypto', 'E-wallet', 'Finbank', 'My payment method']);
    });
});
