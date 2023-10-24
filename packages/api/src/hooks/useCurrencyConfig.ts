import { useCallback, useMemo } from 'react';
import useQuery from '../useQuery';

/** A custom hook to get the currency config information from `website_status` endpoint and `crypto_config` endpoint. */
const useCurrencyConfig = () => {
    const { data: website_status_data, ...rest } = useQuery('website_status');
    const { data: crypto_config_data } = useQuery('crypto_config');

    // Add additional information to the currency config.
    const modified_currencies_config = useMemo(() => {
        if (!website_status_data?.website_status?.currencies_config) return undefined;

        const website_status_currencies_config = website_status_data.website_status.currencies_config;

        return Object.keys(website_status_currencies_config).map(currency => {
            const currency_config = website_status_currencies_config[currency];

            return {
                ...currency_config,
                /** determine if the currency is a `crypto` currency */
                is_crypto: currency_config?.type === 'crypto',
                /** determine if the currency is a `fiat` currency */
                is_fiat: currency_config?.type === 'fiat',
                /** determine if the currency is `Australian Dollar` */
                is_AUD: currency === 'AUD',
                /** determine if the currency is `US Dollar` */
                is_USD: currency === 'USD',
                /** determine if the currency is `Euro` */
                is_EUR: currency === 'EUR',
                /** determine if the currency is `Pound Sterling` */
                is_GBP: currency === 'GBP',
                /** determine if the currency is `Bitcoin` */
                is_BTC: currency === 'BTC',
                /** determine if the currency is `Ethereum` */
                is_ETH: currency === 'ETH',
                /** determine if the currency is `Litecoin` */
                is_LTC: currency === 'LTC',
                /** determine if the currency is `Multi-Collateral DAI` */
                is_DAI: currency === 'DAI',
                /** determine if the currency is `IDK` */
                is_IDK: currency === 'IDK',
                /** determine if the currency is `Paxos Standard` */
                is_PAX: currency === 'PAX',
                /** determine if the currency is `Binary Coin` */
                is_USB: currency === 'USB',
                /** determine if the currency is `Tether Omni` */
                is_USDT: currency === 'UST',
                /** determine if the currency is `True USD` */
                is_TUSD: currency === 'TUSD',
                /** determine if the currency is `Binance USD` */
                is_BUSD: currency === 'BUSD',
                /** determine if the currency is `STATIS Euro` */
                is_EURS: currency === 'EURS',
                /** determine if the currency is `Tether ERC20` */
                is_eUSDT: currency === 'eUSDT',
                /** determine if the currency is `Tether TRC20` */
                is_tUSDT: currency === 'tUSDT',
                /** determine if the currency is `USD Coin` */
                is_USDC: currency === 'USDC',
                /** determine if the currency is `USDK` */
                is_USDK: currency === 'USDK',
                /** Currency code */
                code: currency,
                /** Currency display code */
                display_code: currency === 'UST' ? 'USDT' : currency,
            };
        });
    }, [website_status_data?.website_status?.currencies_config]);

    // Add additional information to the crypto config.
    const modified_crypto_config = useMemo(() => {
        return modified_currencies_config?.map(currency_config => ({
            ...currency_config,
            ...crypto_config_data?.crypto_config?.currencies_config[currency_config.code],
        }));
    }, [crypto_config_data?.crypto_config?.currencies_config, modified_currencies_config]);

    // Transform the currency config array into a record object.
    const transformed_currencies_config = useMemo(() => {
        return modified_crypto_config?.reduce<Record<string, typeof modified_crypto_config[number]>>(
            (previous, current) => ({ ...previous, [current.code]: current }),
            {}
        );
    }, [modified_crypto_config]);

    const getConfig = useCallback(
        (currency: string) => transformed_currencies_config?.[currency],
        [transformed_currencies_config]
    );

    return {
        /** Available currencies and their information */
        data: transformed_currencies_config,
        /** Returns the currency config object for the given currency */
        getConfig,
        ...rest,
    };
};

export default useCurrencyConfig;
