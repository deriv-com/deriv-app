import type { THooks } from '../../../hooks/types';
import { paymentMethods } from '../constants';

export const getPAListWithNormalizedPaymentMethods = (paymentAgents?: THooks.PaymentAgentList) => {
    return paymentAgents?.map(paymentAgent => {
        return {
            ...paymentAgent,
            supported_payment_methods: normalizePaymentMethods(paymentAgent.supported_payment_methods),
        };
    });
};

export const normalizePaymentMethods = (
    supportedPaymentMethods: THooks.PaymentAgentList[number]['supported_payment_methods']
) => {
    const paymentMethods = supportedPaymentMethods
        .map(({ payment_method: paymentMethod }) => paymentMethod && getNormalizedPaymentMethod(paymentMethod))
        .flatMap(paymentMethods => paymentMethods);

    return [...new Set(paymentMethods)].map(paymentMethod => ({ payment_method: paymentMethod }));
};

export const getNormalizedPaymentMethod = (paymentMethod: string) => {
    const normalizedPaymentMethods = Object.entries(paymentMethods).reduce((methods, [key, value]) => {
        if (value.includes(paymentMethod)) {
            methods.push(key);
        }
        return methods;
    }, [] as string[]);

    return normalizedPaymentMethods.length === 0 ? [paymentMethod] : normalizedPaymentMethods;
};
