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
    const { advertiser_page_store, buy_sell_store, general_store } = useStores();
    const { advertiser_details_id, counterparty_type } = advertiser_page_store;
    const { counterparty_advertiser_id, is_advertiser_info_subscribed, list_item_limit } = general_store;
    const { selected_local_currency } = buy_sell_store;

    const {
        data: adverts = [],
        loadMoreAdverts: loadMoreAdvertiserAdverts,
        ...rest
    } = useP2PAdvertList({
        counterparty_type,
        limit: list_item_limit,
        advertiser_id:
            counterparty_advertiser_id && is_advertiser_info_subscribed
                ? counterparty_advertiser_id
                : advertiser_details_id,
        ...(selected_local_currency ? { local_currency: selected_local_currency } : {}),
    });
    const has_more_adverts_to_load = adverts?.length >= list_item_limit ?? false;

    return {
        adverts,
        has_more_adverts_to_load,
        loadMoreAdvertiserAdverts,
        ...rest,
    };
};

export default useP2PAdvertiserAdverts;
