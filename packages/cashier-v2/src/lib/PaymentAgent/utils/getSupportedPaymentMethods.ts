import type { THooks } from '../../../hooks/types';

export const getSupportedPaymentMethods = (paymentAgentList?: THooks.PaymentAgentList) => {
    const supportedPaymentMethods = new Set<string>();

    paymentAgentList?.forEach(paymentAgent => {
        paymentAgent.supported_payment_methods
            .filter(
                //remove Skrill and Neteller from payment methods list (dropdown menu) as per mandate from Paysafe
                ({ payment_method: paymentMethod }) => paymentMethod && !['Neteller', 'Skrill'].includes(paymentMethod)
            )
            .forEach(({ payment_method: paymentMethod }) => {
                if (!paymentMethod) return;

                if (!supportedPaymentMethods.has(paymentMethod)) {
                    supportedPaymentMethods.add(paymentMethod);
                }
            });
    });

    return [...supportedPaymentMethods].sort((a, b) => a.localeCompare(b));
};
