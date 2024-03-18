import { paymentMethods } from '../constants';

export const getNormalizedPaymentMethod = (paymentMethod: string) => {
    const normalizedPaymentMethods = Object.entries(paymentMethods).reduce((methods, [key, value]) => {
        if (value.includes(paymentMethod)) {
            methods.push(key);
        }
        return methods;
    }, [] as string[]);

    return normalizedPaymentMethods.length === 0 ? [paymentMethod] : normalizedPaymentMethods;
};
