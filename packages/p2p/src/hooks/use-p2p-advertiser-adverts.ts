import { useP2PAdvertList } from '@deriv/hooks';
import { useStores } from 'Stores/index';

/**
 * @name useP2PAdvertiserAdverts
 *
 * @description This custom hook returns paginated available adverts for a given advertiser based on their advertiser_id by calling 'p2p_advert_list' endpoint
 * @returns {object} The returned object contains many fields, some of which are explained below:
 * object.loadMoreAdvertiserAdverts - A function to load more adverts.  (used by the InfiniteLoader @see https://github.com/bvaughn/react-virtualized/blob/master/docs/InfiniteLoader.md).
 * object.has_more_adverts_to_load - Whether there are more adverts to load (used by the InfiniteLoader @see https://github.com/bvaughn/react-virtualized/blob/master/docs/InfiniteLoader.md).
 * @example const { adverts, has_more_adverts_to_load, ...rest } = useP2PAdvertiserAdverts();
 * */

const useP2PAdvertiserAdverts = () => {
    const { advertiser_page_store, general_store, buy_sell_store } = useStores();

    const {
        data: adverts = [],
        loadMoreAdverts: loadMoreAdvertiserAdverts,
        ...rest
    } = useP2PAdvertList({
        counterparty_type: advertiser_page_store.counterparty_type,
        offset: 0,
        limit: general_store.list_item_limit,
        advertiser_id:
            general_store.counterparty_advertiser_id && general_store.is_advertiser_info_subscribed
                ? general_store.counterparty_advertiser_id
                : advertiser_page_store.advertiser_details_id,
        ...(buy_sell_store.selected_local_currency ? { local_currency: buy_sell_store.selected_local_currency } : {}),
    });

    const has_more_adverts_to_load = adverts ? adverts?.length >= general_store.list_item_limit : false;
    return {
        adverts,
        has_more_adverts_to_load,
        loadMoreAdvertiserAdverts,
        ...rest,
    };
};

export default useP2PAdvertiserAdverts;
