import useQuery from '../useQuery';
import useActiveAccount from './useActiveAccount';

/** A custom hook that get Service Token for CTrader Platform. */
const useCtraderServiceToken = () => {
    const { data: account } = useActiveAccount();
    const { data: ctrader_token, ...rest } = useQuery('service_token', {
        payload: { service: 'ctrader', server: account?.is_virtual ? 'demo' : 'real' },
    });

    return {
        /** return the ctrader account token */
        data: ctrader_token?.service_token?.ctrader?.token,
        ...rest,
    };
};

export default useCtraderServiceToken;
