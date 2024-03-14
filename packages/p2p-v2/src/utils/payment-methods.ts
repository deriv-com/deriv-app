import { TAccumulatedPaymentMethods, TAdvertiserPaymentMethods, TPaymentMethod, TPaymentMethods } from 'types';

/**
 * **/
// payment method order: Bank Transfer -> EWallets -> Others
const paymentMethodOrder: Record<string, number> = { bank_transfer: 0, other: 2 };

/**
 * Retrieves the order of a payment method.
 * @param method - The payment method.
 * @returns The order of the payment method.
 */
const getPaymentMethodOrder = (method: string) => (!(method in paymentMethodOrder) ? 1 : paymentMethodOrder[method]);

/**
 * Sorts a list of payment methods based on their order.
 * @param paymentMethodsList - The list of payment methods to be sorted.
 * @returns The sorted list of payment methods.
 */
export const sortPaymentMethods = (paymentMethodsList: TAdvertiserPaymentMethods) => {
    return paymentMethodsList?.sort((i, j) => getPaymentMethodOrder(i.method) - getPaymentMethodOrder(j.method));
};

/**
 * Retrieves the payment method objects.
 * @param paymentMethodsList - The list of payment methods.
 * @returns The payment method objects.
 * eg. { 'Bank Transfer': { method: 'bank_transfer', ... }, ... }
 */
export const getPaymentMethodObjects = (paymentMethodsList: TAdvertiserPaymentMethods | TPaymentMethods) =>
    paymentMethodsList?.reduce((acc: TAccumulatedPaymentMethods, curr) => {
        if (curr.display_name) {
            acc[curr.display_name] = curr;
        }
        return acc;
    }, {}) ?? {};

/**
 * Sorts a list of payment methods based on their availability.
 * @param paymentMethodsList - The list of payment methods to be sorted.
 * @returns The sorted list of payment methods.
 * eg. [ { method: 'bank_transfer', isAvailable: true, ... }, ... ]
 * **/
export const sortPaymentMethodsWithAvailability = (
    paymentMethodsList: (TPaymentMethod & { isAvailable?: boolean })[]
) => paymentMethodsList.sort((a, b) => Number(b.isAvailable) - Number(a.isAvailable));
