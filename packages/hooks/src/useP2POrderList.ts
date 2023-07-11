import { useFetch } from '@deriv/api';

/** A custom hook to get the list of p2p order list. */
const useP2POrderList = () => {
    const { data,...rest } = useFetch('p2p_order_list', { payload: {  active:0 } });

    return {
        /** p2p order. */
        data: data?.p2p_order_list?.list,
        ...rest,
    };
};

export default useP2POrderList;