import { deepFreeze, getPropertyValue } from './object';

/**
 * Converts a number into a string of US-supported currency format. For example:
 * 10000 => 10,000.00

 * @param value - The numerical currency value to convert to US-supported currency format
 * @returns 
 */
export const numberToCurrencyText = (value: number) =>
    new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        style: 'decimal',
    }).format(value);

export type TCurrenciesConfig = {
    [key: string]: {
        fractionalDigits: number;
        isDepositSuspended?: 0 | 1;
        isSuspended?: 0 | 1;
        isWithdrawalSuspended?: 0 | 1;
        name?: string;
        stakeDefault?: number;
        transferBetweenAccounts?: {
            fees?: { [key: string]: number };
            limits: {
                [key: string]: unknown;
                max?: number;
                min: number;
            } | null;
            limitsDxtrade?: { [key: string]: unknown };
            limitsMt5?: { [key: string]: unknown };
        };
        type: string;
    };
};

let currenciesConfig: TCurrenciesConfig = {};

export const AMOUNT_MAX_LENGTH = 10;

export const CURRENCY_TYPE = {
    CRYPTO: 'crypto',
    FIAT: 'fiat',
} as const;

/**
 * Formats a monetary value based on the given currency and formatting options.
 *
 * @param {string} currencyValue - The currency symbol or code.
 * @param {number|string} amount - The monetary value to be formatted.
 * @param {boolean} [excludeCurrency=false] - Whether to exclude the currency symbol from the formatted result.
 * @param {number} [decimals=0] - The number of decimal places for the formatted result.
 * @param {number} [minimumFractionDigits=0] - The minimum number of decimal places for the formatted result.
 *
 * @returns {string} - The formatted monetary value as a string.
 *
 * @example
 * ```
 * const formattedAmount = formatMoney('USD', 1234.567, false, 2, 0);
 * console.log(formattedAmount); // "$1,234.57"
 * ```
 */

export const formatMoney = (
    currencyValue: string,
    amount: number | string,
    excludeCurrency?: boolean,
    decimals = 0,
    minimumFractionDigits = 0
) => {
    let money: number | string = amount;
    if (money) money = String(money).replace(/,/g, '');
    const sign = money && Number(money) < 0 ? '-' : '';
    const decimal_places = decimals || getDecimalPlaces(currencyValue);

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

    return sign + (excludeCurrency ? '' : formatCurrency(currencyValue)) + money;
};

/**
 * Formats the given currency into a string that includes a span element with a class name.
 * The class name is a combination of "symbols" and the lowercased currency string.
 *
 * @param {string} currency - The currency string to be formatted.
 * @returns {string} The formatted string that includes a span element with a class name.
 */
export const formatCurrency = (currency: string) => {
    return `<span class="symbols ${(currency || '').toLowerCase()}"></span>`;
};

/**
 * Adds commas to a numeric value for better readability.
 *
 * @param {number|string|null} [num=0] - The numeric value to add commas to.
 * @param {number} [decimalPoints] - The number of decimal points to include. If provided, the value will be formatted with fixed decimal points.
 * @param {boolean} [isCrypto] - Specifies if the number represents a cryptocurrency value.
 *
 * @returns {string} - The formatted numeric value with commas.
 *
 * @example
 * ```
 * const formattedNumber = addComma(1234567.89, 2, false);
 * console.log(formattedNumber); // "1,234,567.89"
 * ```
 */
export const addComma = (num?: number | string | null, decimalPoints?: number, isCrypto?: boolean) => {
    let number: number | string = String(num || 0).replace(/,/g, '');
    if (typeof decimalPoints !== 'undefined') {
        number = (+number).toFixed(decimalPoints);
    }
    if (isCrypto) {
        number = parseFloat(String(number));
    }

    return number
        .toString()
        .replace(/(^|[^\w.])(\d{4,})/g, ($0, $1, $2) => $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, '$&,'));
};

/**
 * Calculates the number of decimal places for the given currency.
 *
 * @param {string} currency - The currency symbol or code.
 * @returns {number} - The number of decimal places for the currency.
 *
 * @example
 * ```
 * const decimalPlaces = calcDecimalPlaces('BTC');
 * console.log(decimalPlaces); // 8
 * ```
 */
export const calcDecimalPlaces = (currency: string) => {
    return isCryptocurrency(currency) ? getPropertyValue(CryptoConfig.get(), [currency, 'fractionalDigits']) : 2;
};

/**
 * Gets the number of decimal places for the given currency.
 *
 * @param {string} [currency=''] - The currency symbol or code.
 * @returns {number} - The number of decimal places for the currency.
 *
 * @example
 * ```
 * const decimalPlaces = getDecimalPlaces('EUR');
 * console.log(decimalPlaces); // 2
 * ```
 */
export const getDecimalPlaces = (currency = '') =>
    // need to check currenciesConfig[currency] exists instead of || in case of 0 value
    currenciesConfig[currency]
        ? getPropertyValue(currenciesConfig, [currency, 'fractionalDigits'])
        : calcDecimalPlaces(currency);

/**
 * Sets the currencies configuration for the website.
 *
 * @param {Object} website_status - The website status object containing currencies configuration.
 * @param {TCurrenciesConfig} website_status.currenciesConfig - The currencies configuration object.
 *
 * @returns {void}
 *
 * @example
 * ```
 * const websiteStatus = {
 *     currenciesConfig: {
 *         EUR: { fractionalDigits: 2 },
 *         USD: { fractionalDigits: 2 },
 *         GBP: { fractionalDigits: 2 },
 *         BTC: { fractionalDigits: 8 },
 *     },
 * };
 * setCurrencies(websiteStatus);
 * ```
 */
export const setCurrencies = (website_status: { currenciesConfig: TCurrenciesConfig }) => {
    currenciesConfig = website_status.currenciesConfig;
};

// (currency in crypto_config) is a back-up in case website_status doesn't include the currency config, in some cases where it's disabled
export const isCryptocurrency = (currency: string) => {
    return /crypto/i.test(getPropertyValue(currenciesConfig, [currency, 'type'])) || currency in CryptoConfig.get();
};

export const CryptoConfig = (() => {
    let crypto_config: any;

    // TODO: [use-shared-i18n] - Use translate function shared among apps or pass in translated names externally.
    const initCryptoConfig = () =>
        deepFreeze({
            BTC: {
                displayCode: 'BTC',
                name: 'Bitcoin',
                minWithdrawal: 0.002,
                paMaxWithdrawal: 5,
                paMinWithdrawal: 0.002,
                fractionalDigits: 8,
            },
            BUSD: {
                displayCode: 'BUSD',
                name: 'Binance USD',
                minWithdrawal: 0.002,
                paMaxWithdrawal: 5,
                paMinWithdrawal: 0.002,
                fractionalDigits: 2,
            },
            DAI: {
                displayCode: 'DAI',
                name: 'Multi-Collateral DAI',
                minWithdrawal: 0.002,
                paMaxWithdrawal: 5,
                paMinWithdrawal: 0.002,
                fractionalDigits: 2,
            },
            EURS: {
                displayCode: 'EURS',
                name: 'STATIS Euro',
                minWithdrawal: 0.002,
                paMaxWithdrawal: 5,
                paMinWithdrawal: 0.002,
                fractionalDigits: 2,
            },
            IDK: {
                displayCode: 'IDK',
                name: 'IDK',
                minWithdrawal: 0.002,
                paMaxWithdrawal: 5,
                paMinWithdrawal: 0.002,
                fractionalDigits: 0,
            },
            PAX: {
                displayCode: 'PAX',
                name: 'Paxos Standard',
                minWithdrawal: 0.002,
                paMaxWithdrawal: 5,
                paMinWithdrawal: 0.002,
                fractionalDigits: 2,
            },
            TUSD: {
                displayCode: 'TUSD',
                name: 'True USD',
                minWithdrawal: 0.002,
                paMaxWithdrawal: 5,
                paMinWithdrawal: 0.002,
                fractionalDigits: 2,
            },
            USDC: {
                displayCode: 'USDC',
                name: 'USD Coin',
                minWithdrawal: 0.002,
                paMaxWithdrawal: 5,
                paMinWithdrawal: 0.002,
                fractionalDigits: 2,
            },
            USDK: {
                displayCode: 'USDK',
                name: 'USDK',
                minWithdrawal: 0.002,
                paMaxWithdrawal: 5,
                paMinWithdrawal: 0.002,
                fractionalDigits: 2,
            },
            eUSDT: {
                displayCode: 'eUSDT',
                name: 'Tether ERC20',
                minWithdrawal: 0.002,
                paMaxWithdrawal: 5,
                paMinWithdrawal: 0.002,
                fractionalDigits: 2,
            },
            tUSDT: {
                displayCode: 'tUSDT',
                name: 'Tether TRC20',
                minWithdrawal: 0.002,
                paMaxWithdrawal: 5,
                paMinWithdrawal: 0.002,
                fractionalDigits: 2,
            },
            BCH: {
                displayCode: 'BCH',
                name: 'Bitcoin Cash',
                minWithdrawal: 0.002,
                paMaxWithdrawal: 5,
                paMinWithdrawal: 0.002,
                fractionalDigits: 8,
            },
            ETH: {
                displayCode: 'ETH',
                name: 'Ether',
                minWithdrawal: 0.002,
                paMaxWithdrawal: 5,
                paMinWithdrawal: 0.002,
                fractionalDigits: 8,
            },
            ETC: {
                displayCode: 'ETC',
                name: 'Ether Classic',
                minWithdrawal: 0.002,
                paMaxWithdrawal: 5,
                paMinWithdrawal: 0.002,
                fractionalDigits: 8,
            },
            LTC: {
                displayCode: 'LTC',
                name: 'Litecoin',
                minWithdrawal: 0.002,
                paMaxWithdrawal: 5,
                paMinWithdrawal: 0.002,
                fractionalDigits: 8,
            },
            UST: {
                displayCode: 'USDT',
                name: 'Tether Omni',
                minWithdrawal: 0.02,
                paMaxWithdrawal: 2000,
                paMinWithdrawal: 10,
                fractionalDigits: 2,
            },
            // USB: {
            //     displayCode: 'USB',
            //     name: 'Binary Coin',
            //     minWithdrawal: 0.02,
            //     paMaxWithdrawal: 2000,
            //     paMinWithdrawal: 10,
            //     fractionalDigits: 2,
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

export type TAccount = {
    account_type: 'demo' | 'real';
    balance: number;
    currency: string;
};
