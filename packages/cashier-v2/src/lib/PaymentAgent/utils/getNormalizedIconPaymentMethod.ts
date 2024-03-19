import { paymentMethodIcons } from '../constants';

export const getNormalizedIconPaymentMethod = (paymentMethod: string) => {
    return Object.entries(paymentMethodIcons).reduce(
        (method, [key, value]) =>
            value.variants.some((el: string) => el === paymentMethod.replace(/[' ,-]/g, '').toLowerCase())
                ? key
                : method,
        ''
    );
};
