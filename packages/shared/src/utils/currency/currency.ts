import { getPropertyValue, deepFreeze } from '../object';

export type TCurrenciesConfig = {
    [k: string]: {
        fractional_digits: number;
        is_deposit_suspended?: 0 | 1;
        is_suspended?: 0 | 1;
        is_withdrawal_suspended?: 0 | 1;
        name?: string;
        stake_default?: number;
        transfer_between_accounts?: {
            fees?: { [k: string]: number };
            limits: {
                max?: number;
                min: number;
                [k: string]: unknown;
            } | null;
            limits_dxtrade?: { [k: string]: unknown };
            limits_mt5?: { [k: string]: unknown };
        };
        type: 'fiat' | 'crypto';
    };
};

let currencies_config: TCurrenciesConfig = {};

const fiat_currencies_display_order: string[] = ['USD', 'EUR', 'GBP', 'AUD'];
const crypto_currencies_display_order: string[] = [
    'TUSDT',
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

export const reorderCurrencies = (list: Array<{ value: string; type: string }>, type: 'fiat' | string = 'fiat') => {
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

export const getRoundedNumber = (number: number, currency: string) => {
    return Number(Number(number).toFixed(getDecimalPlaces(currency)));
};

export const getFormattedText = (number: number, currency: string) => {
    return `${addComma(number, getDecimalPlaces(currency), isCryptocurrency(currency))} ${currency}`;
};

export const formatMoney = (
    currency_value: string,
    amount: number | string,
    exclude_currency?: number,
    decimals = 0,
    minimumFractionDigits = 0
) => {
    let money: number | string = amount;
    if (money) money = String(money).replace(/,/g, '');
    const sign = money && Number(money) < 0 ? '-' : '';
    const decimal_places = decimals || getDecimalPlaces(currency_value);

    money = isNaN(+money) ? 0 : Math.abs(+money);
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

export const formatCurrency = (currency: string) => {
    return `<span class="symbols ${(currency || '').toLowerCase()}"></span>`;
};

export const addComma = (num?: number | string | null, decimal_points?: number, is_crypto?: boolean) => {
    let number: number | string = String(num || 0).replace(/,/g, '');
    if (typeof decimal_points !== 'undefined') {
        number = (+number).toFixed(decimal_points);
    }
    if (is_crypto) {
        number = parseFloat(number);
    }

    return number
        .toString()
        .replace(/(^|[^\w.])(\d{4,})/g, ($0, $1, $2) => $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, '$&,'));
};

export const calcDecimalPlaces = (currency: string) => {
    return isCryptocurrency(currency) ? getPropertyValue(CryptoConfig.get(), [currency, 'fractional_digits']) : 2;
};

export const getDecimalPlaces = (currency: string) =>
    // need to check currencies_config[currency] exists instead of || in case of 0 value
    currencies_config[currency]
        ? getPropertyValue(currencies_config, [currency, 'fractional_digits'])
        : calcDecimalPlaces(currency);

export const hasCorrectDecimalPlaces = (currency: string, amount: number) => {
    const currency_decimal_places = getDecimalPlaces(currency);
    const amount_decimal_array = amount.toString().split('.')[1];
    const amount_decimal_places = amount_decimal_array ? amount_decimal_array.length || 0 : 0;

    return amount_decimal_places <= currency_decimal_places;
};

export const setCurrencies = (website_status: { currencies_config: TCurrenciesConfig }) => {
    currencies_config = website_status.currencies_config;
};

// (currency in crypto_config) is a back-up in case website_status doesn't include the currency config, in some cases where it's disabled
export const isCryptocurrency = (currency: string) => {
    return /crypto/i.test(getPropertyValue(currencies_config, [currency, 'type'])) || currency in CryptoConfig.get();
};

export const CryptoConfig = (() => {
    type TInitCryptoConfig = ReturnType<typeof initCryptoConfig>;
    let crypto_config: TInitCryptoConfig;

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
            tUSDT: {
                display_code: 'tUSDT',
                name: 'Tether TRC20',
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

export const getMinWithdrawal = (currency: string) => {
    return isCryptocurrency(currency) ? getPropertyValue(CryptoConfig.get(), [currency, 'min_withdrawal']) || 0.002 : 1;
};

/**
 * Returns the transfer limits for the account.
 * @param currency
 * @param {string} max|undefined
 * @returns numeric|undefined
 */
export const getTransferLimits = (currency: string, which: 'max' | 'min' | string) => {
    const transfer_limits =
        getPropertyValue(currencies_config, [currency, 'transfer_between_accounts', 'limits']) ||
        getMinWithdrawal(currency);
    const decimals = getDecimalPlaces(currency);
    if (which === 'max') {
        return transfer_limits.max ? transfer_limits.max.toFixed(decimals) : undefined;
    }

    return transfer_limits.min ? transfer_limits.min.toFixed(decimals) : undefined;
};

export const getTransferFee = (currency_from: string, currency_to: string) => {
    const transfer_fee = getPropertyValue(currencies_config, [
        currency_from,
        'transfer_between_accounts',
        'fees',
        currency_to,
    ]);
    return `${typeof transfer_fee === 'undefined' ? '1' : transfer_fee}%`;
};

// returns in a string format, e.g. '0.00000001'
export const getMinimumTransferFee = (currency: string) => {
    const decimals = getDecimalPlaces(currency);
    return `${currency} ${(1 / Math.pow(10, decimals)).toFixed(decimals)}`; // we need toFixed() so that it doesn't display in scientific notation, e.g. 1e-8 for currencies with 8 decimal places
};

// @param {String} limit = max|min
export const getPaWithdrawalLimit = (currency: string, limit: 'max' | 'min' | string) => {
    if (isCryptocurrency(currency)) {
        return getPropertyValue(CryptoConfig.get(), [currency, `pa_${limit}_withdrawal`]); // pa_min_withdrawal and pa_max_withdrawal used here
    }
    return limit === 'max' ? 2000 : 10; // limits for fiat currency
};

export const getCurrencyDisplayCode = (currency = '') => {
    // eslint-disable-next-line
    if (currency !== 'eUSDT' && currency !== 'tUSDT') currency = currency.toUpperCase();
    return getPropertyValue(CryptoConfig.get(), [currency, 'display_code']) || currency;
};

export const getCurrencyName = (currency = '') =>
    currency === 'USDT' ? 'Tether Omni' : getPropertyValue(currencies_config, [currency, 'name']) || '';

export const getMinPayout = (currency: string) => {
    return getPropertyValue(currencies_config, [currency, 'stake_default']);
};

export const getCurrencies = () => {
    return currencies_config;
};
