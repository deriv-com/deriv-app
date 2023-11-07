import useQuery from '../useQuery';
import useActiveAccount from './useActiveAccount';

/** A custom hook that get Service Token for Deriv X Platform. */
const useDxtradeServiceToken = () => {
    const { data: account } = useActiveAccount();
    const { data: dxtrade_token, ...rest } = useQuery('service_token', {
        payload: { service: 'dxtrade', server: account?.is_virtual ? 'demo' : 'real' },
    });

    return {
        /** return the Deriv X account token */
        data: dxtrade_token?.service_token?.dxtrade?.token,
        ...rest,
    };
};

export default useDxtradeServiceToken;
