import useAuthorizedQuery from '../useAuthorizedQuery';

const useCryptoConfig = () => {
    // 15 seconds, as crypto_config potentially contains dynamic data
    // so caching is there only to prevent multiple requests in a short time
    // generally it should be fresh data
    return useAuthorizedQuery(
        'crypto_config',
        {},
        {
            staleTime: 15 * 1000,
        }
    );
};

export default useCryptoConfig;
