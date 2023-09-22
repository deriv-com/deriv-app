import React from 'react';
import { isMobile } from '@deriv/shared';
import { useP2PAdvertList } from '@deriv/hooks';
import { buy_sell } from 'Constants/buy-sell';
import { useStores } from 'Stores/index';

type TAdvertList = ReturnType<typeof useP2PAdvertList>['data'];

/**
 * @name getSearchResults
 * Filter out adverts based on the search term. Btw, this causes a bug that's in production as well.
 * If a user doesn't scroll to the bottom before searching, the items that fall outside of the limit won't be part of the search results.
 *  */
const getSearchResults = (items: TAdvertList, search_term: string) => {
    if (search_term) {
        return items?.filter(item =>
            item.advertiser_details.name.toLowerCase().includes(search_term.toLowerCase().trim())
        );
    }
};

/**
 *  @name getRenderedAdverts
 * @returns { Array } - adverts that are ready to be rendered. Adverts that consist of a combination of items filtered based on the
 * Buy/Sell toggle and the search term. See useP2PRenderedAdverts for more information.
 */
const getRenderedAdverts = (search_term: string, search_results: TAdvertList, filtered_items: TAdvertList = []) => {
    let rendered_adverts: DeepPartial<TAdvertList> = [];
    if (isMobile()) {
        if (search_term) {
            rendered_adverts = [{ id: 'WATCH_THIS_SPACE' }, { id: 'NO_MATCH_ROW' }];
            if (search_results && search_results.length > 0) {
                rendered_adverts = [{ id: 'WATCH_THIS_SPACE' }, ...search_results];
            }
        } else {
            // This allows for the sliding animation on the Buy/Sell toggle as it pushes
            // an empty item with an item that holds the same height of the toggle container.
            // Also see: buy-sell-row.jsx
            rendered_adverts = [{ id: 'WATCH_THIS_SPACE' }, ...filtered_items];
        }
    } else {
        rendered_adverts = filtered_items;
        if (search_term) {
            rendered_adverts = [{ id: 'NO_MATCH_ROW' }];
            if (search_results && search_results.length > 0) {
                rendered_adverts = search_results;
            }
        }
    }
    return rendered_adverts;
};

/**
 * @name useP2PRenderedAdverts
 *
 * @description This custom hook returns paginated available adverts in a format that's ready to be rendered by calling 'p2p_advert_list' endpoint
 * @returns {object} The returned object contains many fields, some of which are explained below:
 * object.loadMore - A function to load more adverts.  (used by the InfiniteLoader @see https://github.com/bvaughn/react-virtualized/blob/master/docs/InfiniteLoader.md).
 * object.has_more_adverts_to_load - Whether there are more adverts to load (used by the InfiniteLoader @see https://github.com/bvaughn/react-virtualized/blob/master/docs/InfiniteLoader.md).
 * @example const { rendered_adverts, has_more_items_to_load, loadMore, ...rest } = useP2PRenderedAdverts();
 *
 * */
const useP2PRenderedAdverts = () => {
    const { general_store, buy_sell_store } = useStores();
    const counterparty_type = buy_sell_store.is_buy ? buy_sell.BUY : buy_sell.SELL;

    const { data: items = [], ...rest } = useP2PAdvertList({
        counterparty_type,
        limit: general_store.list_item_limit,
        sort_by: buy_sell_store.sort_by,
        use_client_limits: buy_sell_store.should_use_client_limits ? 1 : 0,
        ...(buy_sell_store.selected_payment_method_value.length > 0
            ? { payment_method: buy_sell_store.selected_payment_method_value }
            : {}),
        ...(buy_sell_store.selected_local_currency ? { local_currency: buy_sell_store.selected_local_currency } : {}),
    });

    const has_more_items_to_load = items ? items?.length >= general_store.list_item_limit : false;

    // Filter out adverts based on the Buy/Sell toggle. If the toggle is set to Buy, only show Sell adverts and vice versa.
    const filtered_items = React.useMemo(() => {
        return items.filter(item =>
            buy_sell_store.table_type === buy_sell.BUY ? item.type === buy_sell.SELL : item.type === buy_sell.BUY
        );
    }, [items, buy_sell_store.table_type]);

    const search_results = React.useMemo(() => {
        return getSearchResults(items, buy_sell_store.search_term);
    }, [buy_sell_store.search_term, items]);

    const rendered_adverts = React.useMemo(() => {
        return getRenderedAdverts(buy_sell_store.search_term, search_results, filtered_items);
    }, [buy_sell_store.search_term, filtered_items, search_results]);

    return {
        rendered_adverts,
        has_more_items_to_load,
        ...rest,
    };
};

export default useP2PRenderedAdverts;
