import PaymentAgentProviders from '../constants/payment-agent-providers';

export const getNormalizedPaymentMethod = payment_method => {
    const trimmed_payment_method = payment_method.replace(/[' ',-]/g, '').toLowerCase();

    const normalized_payment_method = Object.entries(PaymentAgentProviders.normalized_payment_methods).reduce(
        (pay_method, [key, value]) => (value.some(el => el === trimmed_payment_method) ? key : pay_method),
        ''
    );

    return normalized_payment_method;
};
