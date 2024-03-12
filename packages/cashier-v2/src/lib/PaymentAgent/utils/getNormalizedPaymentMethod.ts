import { paymentMethods } from '../constants';

export const getNormalizedPaymentMethod = (paymentMethod: string) => {
    const normalizedPaymentMethod = Object.entries(paymentMethods).reduce(
        (method, [key, value]) => (value.some((el: string) => el === paymentMethod) ? key : method),
        ''
    );

    return normalizedPaymentMethod || paymentMethod;
};
