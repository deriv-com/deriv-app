import type { THooks } from '../../../hooks/types';
import { getNormalizedPaymentMethod } from './getNormalizedPaymentMethod';

export const getSupportedPaymentMethods = (paymentAgentList?: THooks.PaymentAgentList) => {
    const supportedPaymentMethods = new Set<string>();

    paymentAgentList?.forEach(paymentAgent => {
        paymentAgent.supported_payment_methods
            .map(({ payment_method: paymentMethod }) => {
                if (!paymentMethod) return;

                const normalizedPaymentMethods = getNormalizedPaymentMethod(paymentMethod);

                //remove Skrill and Neteller from payment methods list (dropdown menu) as per mandate from Paysafe
                return normalizedPaymentMethods.filter(method => !['Neteller', 'Skrill'].includes(method));
            })
            .forEach((paymentMethod?: string[]) => {
                if (!paymentMethod) return;

                paymentMethod.forEach(method => {
                    if (!supportedPaymentMethods.has(method)) {
                        supportedPaymentMethods.add(method);
                    }
                });
            });
    });

    return [...supportedPaymentMethods].sort((a, b) => a.localeCompare(b));
};
