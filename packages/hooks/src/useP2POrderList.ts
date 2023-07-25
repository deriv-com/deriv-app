import { useFetch } from '@deriv/api';
import { isMobile } from '@deriv/shared';

/** A custom hook to get the list of p2p order list. */
const useP2POrderList = () => {
    const list_item_limit = isMobile() ? 10 : 50;
    const { data, ...rest } = useFetch('p2p_order_list', { payload: { active: 0, offset: 0, limit: list_item_limit } });
    return {
        /** p2p order. */
        data: data?.p2p_order_list?.list,
        ...rest,
    };
};

export default useP2POrderList;
