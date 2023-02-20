import BinarySocket from '_common/base/socket_base';

export const getExchangeRate = async (from_currency, to_currency) => {
    const { exchange_rates } = await BinarySocket.exchange_rates(from_currency);

    return exchange_rates?.rates?.[to_currency];
};
