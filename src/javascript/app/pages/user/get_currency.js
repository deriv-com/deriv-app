const Client   = require('../../base/client');
const Currency = require('../../common/currency');

const GetCurrency = (() => {
    const getCurrenciesOfOtherAccounts = () => {
        const all_loginids     = Client.getAllLoginids();
        const other_currencies = [];
        all_loginids.forEach((loginid) => {
            // if it's not current client or virtual client, consider the currency
            if (Client.get('loginid') !== loginid && Client.getAccountType(loginid) !== 'virtual') {
                const currency = Client.get('currency', loginid);
                if (currency) {
                    other_currencies.push(currency);
                }
            }
        });
        return other_currencies;
    };

    const getCurrencyValues = () => {
        const currencies       = Currency.getCurrencies();
        const fiat_currencies  = [];
        const cryptocurrencies = [];
        Object.keys(currencies).forEach((currency) => {
            if (currencies[currency].type === 'fiat') {
                fiat_currencies.push(currency);
            } else {
                cryptocurrencies.push(currency);
            }
        });
        const other_currencies = getCurrenciesOfOtherAccounts();

        return {
            cryptocurrencies,
            other_currencies,

            has_fiat: other_currencies.some(currency => fiat_currencies.indexOf(currency) > -1),
        };
    };

    const getCurrencies = (landing_company) => {
        const client_currency = Client.get('currency');
        const is_crypto       = Currency.isCryptocurrency(client_currency);
        const currency_values = getCurrencyValues();

        const allowed_currencies =
              Client.getLandingCompanyValue({ real: 1 }, landing_company, 'legal_allowed_currencies');

        const available_crypto =
              currency_values.cryptocurrencies.filter(c =>
                  currency_values.other_currencies.concat(is_crypto ? client_currency : []).indexOf(c) < 0 &&
                  allowed_currencies.indexOf(c) > -1);
        const can_open_crypto  = available_crypto.length;

        let currencies_to_show = [];
        // only allow client to open more sub accounts if the last currency is not to be reserved for master account
        if ((client_currency && (can_open_crypto || !currency_values.has_fiat)) ||
            (!client_currency && (available_crypto.length > 1 || (can_open_crypto && !currency_values.has_fiat)))) {
            // if have sub account with fiat currency, or master account is fiat currency, only show cryptocurrencies
            // else show all
            currencies_to_show =
                currency_values.has_fiat || (!is_crypto && client_currency) ?
                    available_crypto : allowed_currencies;
            // remove client's currency and sub account currencies from list of currencies to show
            currencies_to_show = currencies_to_show.filter(c =>
                currency_values.other_currencies.concat(client_currency).indexOf(c) < 0);
        }

        return currencies_to_show;
    };

    return {
        getCurrenciesOfOtherAccounts,
        getCurrencies,
    };
})();

module.exports = GetCurrency;
