import useFetch from '../useFetch';
import useActiveAccount from './useActiveAccount';

/** A custom hook that get Service Token for DerivEz Platform. */
const useDerivezServiceToken = () => {
    const { data: account } = useActiveAccount();
    const { data: derivez_token, ...rest } = useFetch('service_token', {
        payload: { service: 'pandats', server: account?.is_virtual ? 'demo' : 'real' },
    });

    return {
        /** return the DerivEz account token */
        data: derivez_token?.service_token?.pandats?.token,
        ...rest,
    };
};

export default useDerivezServiceToken;
