const currenciesPaymentAgentAvailability = (legal_allowed_currencies, all_payment_agent_list, account_list) => {
    const result = [];
    legal_allowed_currencies.forEach(currency => {
        result.push({
            ...currency,
            has_payment_agent: !!all_payment_agent_list?.filter(agent => agent.currencies === currency.value).length,
            is_disabled: account_list?.some(account => account.title === currency.value && account.is_disabled),
        });
    });
    return result;
};

const currenciesOnRampAvailability = legal_allowed_currencies => {
    return legal_allowed_currencies.filter(({ platform }) => platform.ramp.length > 0);
};

export default {
    currenciesOnRampAvailability,
    currenciesPaymentAgentAvailability,
};
