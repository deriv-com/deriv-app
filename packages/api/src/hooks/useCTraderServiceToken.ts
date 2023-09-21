import useFetch from '../useFetch';
import useActiveAccount from './useActiveAccount';

/** A custom hook that get Service Token for CTrader Platform. */
const useCTraderServiceToken = () => {
    const { data: account } = useActiveAccount();
    const { data: ctrader_token, ...rest } = useFetch('service_token', {
        payload: { service: 'ctrader', server: account?.is_virtual ? 'demo' : 'real' },
    });

    return {
        /** return the ctrader account token */
        data: ctrader_token?.service_token?.ctrader?.token,
        ...rest,
    };
};

export default useCTraderServiceToken;
