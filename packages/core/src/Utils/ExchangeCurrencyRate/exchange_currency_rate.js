import BinarySocket from '_common/base/socket_base';

export const getExchangeRate = async (from_currency, to_currency) => {
    //replace with the one comes from store
    const { exchange_rates } = await BinarySocket.exchange_rates(from_currency);

    return exchange_rates?.rates?.[to_currency];
};
