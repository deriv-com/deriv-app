import { isCryptocurrency } from '@deriv/shared';
import { localize } from '@deriv/translations';

type TCurrencyList = {
    text: string;
    value: string;
    has_tooltip: boolean;
}[];

export const buildCurrenciesList = (payout_currencies: string[]) => {
    const fiat: TCurrencyList = [];
    const crypto: TCurrencyList = [];

    payout_currencies.forEach(cur => {
        const isCrypto = isCryptocurrency(cur);
        (isCrypto ? crypto : fiat).push({ text: cur, value: cur, has_tooltip: isCrypto });
    });

    return {
        [localize('Fiat')]: fiat,
        [localize('Crypto')]: crypto,
    };
};

export const getDefaultCurrency = (currencies_list: Record<string, TCurrencyList>, currency = '') => {
    const supported_currencies = Object.values(currencies_list).reduce((a, b) => [...a, ...b], []);
    const default_currency = supported_currencies.find(c => c.value === currency)
        ? currency
        : supported_currencies[0].value;

    return {
        currency: default_currency,
    };
};
