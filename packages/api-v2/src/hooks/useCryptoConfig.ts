import { useCallback } from 'react';
import useAuthorize from './useAuthorize';
import useAuthorizedQuery from '../useAuthorizedQuery';

/** A custom hook to get the cryptocurrencies config information from `crypto_config` endpoint. */
const useCryptoConfig = (options?: Parameters<typeof useAuthorizedQuery<'crypto_config'>>[2]) => {
    const { data: authorizeData, isLoading: isAuthorizeLoading } = useAuthorize();

    const { data, isLoading: isCryptConfigLoading, ...rest } = useAuthorizedQuery('crypto_config', {}, { ...options });

    const cryptoConfig = authorizeData?.currency
        ? data?.crypto_config?.currencies_config[authorizeData?.currency]
        : null;

    const getConfig = useCallback(
        (currency: string) => data?.crypto_config?.currencies_config[currency],
        [data?.crypto_config?.currencies_config]
    );

    return {
        /** Available cryptocurrencies config for authorized account*/
        data: cryptoConfig,
        /** Returns the crypto config object for the given currency */
        getConfig,
        isLoading: isAuthorizeLoading || isCryptConfigLoading,
        ...rest,
    };
};

export default useCryptoConfig;
