import { getPropertyValue, deepFreeze } from '../object';

let currencies_config = {};

const fiat_currencies_display_order = ['USD', 'EUR', 'GBP', 'AUD'];
const crypto_currencies_display_order = [
    'BTC',
    'ETH',
    'LTC',
    'UST',
    'eUSDT',
    'BUSD',
    'DAI',
    'EURS',
    'IDK',
    'PAX',
    'TUSD',
    'USDC',
    'USDK',
];

export const reorderCurrencies = (list, type = 'fiat') => {
    const new_order = type === 'fiat' ? fiat_currencies_display_order : crypto_currencies_display_order;

    return list.sort((a, b) => {
        if (new_order.indexOf(a.value) < new_order.indexOf(b.value)) {
            return -1;
        }
        if (new_order.indexOf(a.value) > new_order.indexOf(b.value)) {
            return 1;
        }
        return 0;
    });
};

export const AMOUNT_MAX_LENGTH = 10;

export const getRoundedNumber = (number, currency) => {
    return Number(Number(number).toFixed(getDecimalPlaces(currency)));
};

export const getFormattedText = (number, currency) => {
    return `${addComma(number, getDecimalPlaces(currency), isCryptocurrency(currency))} ${currency}`;
};

export const formatMoney = (currency_value, amount, exclude_currency, decimals = 0, minimumFractionDigits = 0) => {
    let money = amount;
    if (money) money = String(money).replace(/,/g, '');
    const sign = money && Number(money) < 0 ? '-' : '';
    const decimal_places = decimals || getDecimalPlaces(currency_value);

    money = isNaN(money) ? 0 : Math.abs(money);
    if (typeof Intl !== 'undefined') {
        const options = {
            minimumFractionDigits: minimumFractionDigits || decimal_places,
            maximumFractionDigits: decimal_places,
        };
        // TODO: [use-shared-i18n] - Use a getLanguage function to determine number format.
        money = new Intl.NumberFormat('en', options).format(money);
    } else {
        money = addComma(money, decimal_places);
    }

    return sign + (exclude_currency ? '' : formatCurrency(currency_value)) + money;
};

export const formatCurrency = currency => {
    return `<span class="symbols ${(currency || '').toLowerCase()}"></span>`;
};

export const addComma = (num, decimal_points, is_crypto) => {
    let number = String(num || 0).replace(/,/g, '');
    if (typeof decimal_points !== 'undefined') {
        number = (+number).toFixed(decimal_points);
    }
    if (is_crypto) {
        number = parseFloat(+number);
    }

    return number
        .toString()
        .replace(/(^|[^\w.])(\d{4,})/g, ($0, $1, $2) => $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, '$&,'));
};

export const calcDecimalPlaces = currency => {
    return isCryptocurrency(currency) ? getPropertyValue(CryptoConfig.get(), [currency, 'fractional_digits']) : 2;
};

export const getDecimalPlaces = currency =>
    // need to check currencies_config[currency] exists instead of || in case of 0 value
    currencies_config[currency]
        ? getPropertyValue(currencies_config, [currency, 'fractional_digits'])
        : calcDecimalPlaces(currency);

export const hasCorrectDecimalPlaces = (currency, amount) => {
    const currency_decimal_places = getDecimalPlaces(currency);
    const amount_decimal_array = amount.toString().split('.')[1];
    const amount_decimal_places = amount_decimal_array ? amount_decimal_array.length || 0 : 0;

    return amount_decimal_places <= currency_decimal_places;
};

export const setCurrencies = website_status => {
    currencies_config = website_status.currencies_config;
};

// (currency in crypto_config) is a back-up in case website_status doesn't include the currency config, in some cases where it's disabled
export const isCryptocurrency = currency => {
    return /crypto/i.test(getPropertyValue(currencies_config, [currency, 'type'])) || currency in CryptoConfig.get();
};

export const CryptoConfig = (() => {
    let crypto_config;

    // TODO: [use-shared-i18n] - Use translate function shared among apps or pass in translated names externally.
    const initCryptoConfig = () =>
        deepFreeze({
            BTC: {
                display_code: 'BTC',
                name: 'Bitcoin',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 8,
            },
            BUSD: {
                display_code: 'BUSD',
                name: 'Binance USD',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 2,
            },
            DAI: {
                display_code: 'DAI',
                name: 'Multi-Collateral DAI',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 2,
            },
            EURS: {
                display_code: 'EURS',
                name: 'STATIS Euro',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 2,
            },
            IDK: {
                display_code: 'IDK',
                name: 'IDK',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 0,
            },
            PAX: {
                display_code: 'PAX',
                name: 'Paxos Standard',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 2,
            },
            TUSD: {
                display_code: 'TUSD',
                name: 'True USD',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 2,
            },
            USDC: {
                display_code: 'USDC',
                name: 'USD Coin',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 2,
            },
            USDK: {
                display_code: 'USDK',
                name: 'USDK',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 2,
            },
            eUSDT: {
                display_code: 'eUSDT',
                name: 'Tether ERC20',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 2,
            },
            BCH: {
                display_code: 'BCH',
                name: 'Bitcoin Cash',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 8,
            },
            ETH: {
                display_code: 'ETH',
                name: 'Ether',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 8,
            },
            ETC: {
                display_code: 'ETC',
                name: 'Ether Classic',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 8,
            },
            LTC: {
                display_code: 'LTC',
                name: 'Litecoin',
                min_withdrawal: 0.002,
                pa_max_withdrawal: 5,
                pa_min_withdrawal: 0.002,
                fractional_digits: 8,
            },
            UST: {
                display_code: 'USDT',
                name: 'Tether Omni',
                min_withdrawal: 0.02,
                pa_max_withdrawal: 2000,
                pa_min_withdrawal: 10,
                fractional_digits: 2,
            },
            // USB: {
            //     display_code: 'USB',
            //     name: 'Binary Coin',
            //     min_withdrawal: 0.02,
            //     pa_max_withdrawal: 2000,
            //     pa_min_withdrawal: 10,
            //     fractional_digits: 2,
            // },
        });

    return {
        get: () => {
            if (!crypto_config) {
                crypto_config = initCryptoConfig();
            }
            return crypto_config;
        },
    };
})();

export const getMinWithdrawal = currency => {
    return isCryptocurrency(currency) ? getPropertyValue(CryptoConfig.get(), [currency, 'min_withdrawal']) || 0.002 : 1;
};

/**
 * Returns the transfer limits for the account.
 * @param currency
 * @param {string} max|undefined
 * @returns numeric|undefined
 */
export const getTransferLimits = (currency, which) => {
    const transfer_limits =
        getPropertyValue(currencies_config, [currency, 'transfer_between_accounts', 'limits']) ||
        getMinWithdrawal(currency);
    const decimals = getDecimalPlaces(currency);
    if (which === 'max') {
        return transfer_limits.max ? transfer_limits.max.toFixed(decimals) : undefined;
    }

    return transfer_limits.min ? transfer_limits.min.toFixed(decimals) : undefined;
};

export const getTransferFee = (currency_from, currency_to) => {
    const transfer_fee = getPropertyValue(currencies_config, [
        currency_from,
        'transfer_between_accounts',
        'fees',
        currency_to,
    ]);
    return `${typeof transfer_fee === 'undefined' ? '1' : transfer_fee}%`;
};

// returns in a string format, e.g. '0.00000001'
export const getMinimumTransferFee = currency => {
    const decimals = getDecimalPlaces(currency);
    return `${currency} ${(1 / Math.pow(10, decimals)).toFixed(decimals)}`; // we need toFixed() so that it doesn't display in scientific notation, e.g. 1e-8 for currencies with 8 decimal places
};

// @param {String} limit = max|min
export const getPaWithdrawalLimit = (currency, limit) => {
    if (isCryptocurrency(currency)) {
        return getPropertyValue(CryptoConfig.get(), [currency, `pa_${limit}_withdrawal`]); // pa_min_withdrawal and pa_max_withdrawal used here
    }
    return limit === 'max' ? 2000 : 10; // limits for fiat currency
};

export const getCurrencyDisplayCode = (currency = '') => {
    // eslint-disable-next-line
    if (currency !== 'eUSDT') currency = currency.toUpperCase();
    return getPropertyValue(CryptoConfig.get(), [currency, 'display_code']) || currency;
};

export const getCurrencyName = (currency = '') =>
    currency === 'USDT' ? 'Tether Omni' : getPropertyValue(currencies_config, [currency, 'name']) || '';

export const getMinPayout = currency => {
    return getPropertyValue(currencies_config, [currency, 'stake_default']);
};

export const getCurrencies = () => {
    return currencies_config;
};
