import { WS }            from 'Services';
import {
    buildCurrenciesList,
    getDefaultCurrency } from '../Helpers/currency';

export const getCurrenciesAsync = async(currency) => {
    const response = await WS.payoutCurrencies();
    console.log(currency)
    console.log('hi')

    const currencies_list  = buildCurrenciesList(response.payout_currencies);
    const default_currency = getDefaultCurrency(currencies_list, currency);

    return {
        currencies_list,
        ...(default_currency),
    };
};
