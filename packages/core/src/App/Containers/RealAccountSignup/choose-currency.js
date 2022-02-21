const currenciesPaymentAgentAvailability = (legal_allowed_currencies, all_payment_agent_list, account_list) => {
    const result = [];
    legal_allowed_currencies.forEach(currency => {
        result.push({
            ...currency,
            has_payment_agent: !!all_payment_agent_list?.paymentagent_list?.list.filter(
                agent => agent.currencies === currency.value
            ).length,
            is_disabled: account_list?.filter(accouunt => accouunt.title === currency.value).map(a => a.is_disabled)[0],
        });
    });
    return result;
};

export default {
    currenciesPaymentAgentAvailability,
};
