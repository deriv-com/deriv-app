import Constants from 'Constants/constants';
import { getNormalizedPaymentMethod } from 'Utils/utility';

export const hasNormalizedPaymentMethods = (all_payment_methods?: { payment_method: string }[]) => {
    if (all_payment_methods && all_payment_methods.length > 0) {
        return !all_payment_methods.every(
            (method: { payment_method: string }) =>
                getNormalizedPaymentMethod(method.payment_method, Constants.icon_payment_methods, true) === ''
        );
    }
    return false;
};

export const getUniquePaymentAgentSupportedBanks = (supported_banks?: { payment_method: string }[]) => {
    const normalized_payment_methods =
        supported_banks &&
        supported_banks
            .map(bank => getNormalizedPaymentMethod(bank.payment_method, Constants.icon_payment_methods, true))
            .filter(Boolean);
    return Array.from(new Set(normalized_payment_methods));
};
