import PaymentAgentProviders from '../constants/payment-agent-providers';

export const getNormalizedPaymentMethod = payment_method => {
    const trimmed_payment_method = payment_method.replace(/[' ',-]/g, '').toLowerCase();

    const normalized_payment_method = Object.entries(PaymentAgentProviders.normalized_payment_methods).reduce(
        (pay_method, [key, value]) => (value.some(el => el === trimmed_payment_method) ? key : pay_method),
        ''
    );

    return normalized_payment_method;
};

export const hasNormalizedPaymentMethods = all_payment_methods => {
    if (all_payment_methods.length > 0) {
        return !all_payment_methods.every(method => getNormalizedPaymentMethod(method.payment_method) === '');
    }
    return false;
};

export const getUniquePaymentAgentSupportedBanks = supported_banks => {
    const normalized_payment_methods = supported_banks
        .map(bank => getNormalizedPaymentMethod(bank.payment_method))
        .filter(Boolean);
    return [...new Set(normalized_payment_methods)];
};
