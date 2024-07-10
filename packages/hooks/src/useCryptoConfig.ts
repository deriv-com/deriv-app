import { useQuery } from '@deriv/api';

const useCryptoConfig = (currency: string) => {
    const { data, ...rest } = useQuery('crypto_config', { payload: { currency_code: currency } });

    const cryptoConfig = data?.crypto_config?.currencies_config[currency];

    return {
        /** Available cryptocurrencies config for authorized account*/
        data: cryptoConfig,
        ...rest,
    };
};

export default useCryptoConfig;
