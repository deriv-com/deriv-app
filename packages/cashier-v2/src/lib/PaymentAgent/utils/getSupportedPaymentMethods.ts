import type { THooks } from '../../../hooks/types';
import { getNormalizedPaymentMethod } from './getNormalizedPaymentMethod';

export const getSupportedPaymentMethods = (paymentAgentList?: THooks.PaymentAgentList) => {
    const supportedPaymentMethods: string[] = [];

    paymentAgentList?.forEach(paymentAgent => {
        paymentAgent.supported_payment_methods
            .map(({ payment_method: paymentMethod }) => {
                if (!paymentMethod) return;

                const normalizedPaymentMethod = getNormalizedPaymentMethod(paymentMethod);

                //remove Skrill and Neteller from payment methods list (dropdown menu) as per mandate from Paysafe
                return ['Neteller', 'Skrill'].includes(normalizedPaymentMethod) ? '' : normalizedPaymentMethod;
            })
            .filter(Boolean)
            .forEach((paymentMethod?: string) => {
                if (!paymentMethod) return;

                const isSupportedPaymentMethodExist = supportedPaymentMethods.some(
                    supportedPaymentMethod => supportedPaymentMethod.toLowerCase() === paymentMethod?.toLowerCase()
                );

                if (!isSupportedPaymentMethodExist) {
                    supportedPaymentMethods.push(paymentMethod);
                }
            });
    });

    return supportedPaymentMethods.sort();
};
