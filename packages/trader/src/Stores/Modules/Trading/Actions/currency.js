import { WS }            from 'Services/ws-methods';
import {
    buildCurrenciesList,
    getDefaultCurrency } from '../Helpers/currency';

export const getCurrenciesAsync = async(currency) => {
    const response = await WS.authorized.storage.payoutCurrencies();

    const currencies_list  = buildCurrenciesList(response.payout_currencies);
    const default_currency = getDefaultCurrency(currencies_list, currency);

    return {
        currencies_list,
        ...(default_currency),
    };
};
