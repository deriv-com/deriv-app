import Constants from 'Constants/constants';
import { getNormalizedPaymentMethod } from 'Utils/utility';

export const hasNormalizedPaymentMethods = all_payment_methods => {
    if (all_payment_methods.length > 0) {
        return !all_payment_methods.every(
            method => getNormalizedPaymentMethod(method.payment_method, Constants.icon_payment_methods, true) === ''
        );
    }
    return false;
};

export const getUniquePaymentAgentSupportedBanks = supported_banks => {
    const normalized_payment_methods = supported_banks
        .map(bank => getNormalizedPaymentMethod(bank.payment_method, Constants.icon_payment_methods, true))
        .filter(Boolean);
    return [...new Set(normalized_payment_methods)];
};
