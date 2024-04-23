import useQuery from '../useQuery';
import useAuthorize from './useAuthorize';

/** A custom hook to get the cryptocurrencies config information from `crypto_config` endpoint. */
const useCryptoConfig = () => {
    const { data: authorizeData, isSuccess, isLoading: isAuthorizeLoading } = useAuthorize();

    const {
        data,
        isLoading: isCryptConfigLoading,
        ...rest
    } = useQuery('crypto_config', {
        options: {
            enabled: isSuccess && Boolean(authorizeData?.currency),
        },
    });

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
