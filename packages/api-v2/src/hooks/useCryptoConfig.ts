import useAuthorize from './useAuthorize';
import useAuthorizedQuery from '../useAuthorizedQuery';

/** A custom hook to get the cryptocurrencies config information from `crypto_config` endpoint. */
const useCryptoConfig = () => {
    const { data: authorizeData, isLoading: isAuthorizeLoading } = useAuthorize();

    const { data, isLoading: isCryptConfigLoading, ...rest } = useAuthorizedQuery('crypto_config');

    const cryptoConfig = authorizeData?.currency
        ? data?.crypto_config?.currencies_config[authorizeData?.currency]
        : null;

    return {
        /** Available cryptocurrencies config */
        data: cryptoConfig,
        isLoading: isAuthorizeLoading || isCryptConfigLoading,
        ...rest,
    };
};

export default useCryptoConfig;
