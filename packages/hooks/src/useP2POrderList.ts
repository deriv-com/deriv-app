import { useSubscription } from '@deriv/api';

/** A custom hook to subscribe to p2p_order_list */
const useP2POrderList = () => {
    const { data, ...rest } = useSubscription('p2p_order_list');

    return {
        /** List of p2p orders for the current user */
        data,
        ...rest,
    };
};

export default useP2POrderList;
