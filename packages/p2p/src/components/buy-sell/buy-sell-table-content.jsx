import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import { localize } from 'Components/i18next';
import Dp2pContext from 'Components/context/dp2p-context';
import Empty from 'Components/empty/empty.jsx';
import { InfiniteLoaderList } from 'Components/table/infinite-loader-list.jsx';
import { TableError } from 'Components/table/table-error.jsx';
import { height_constants } from 'Utils/height_constants';
import { requestWS } from 'Utils/websocket';
import { RowComponent, BuySellRowLoader } from './row.jsx';
import { BuySellTable } from './buy-sell-table.jsx';
import { buy_sell } from '../../constants/buy-sell';

const BuySellTableContent = ({ is_buy, setSelectedAdvert, showAdvertiserPage }) => {
    const { list_item_limit } = React.useContext(Dp2pContext);
    const item_offset = React.useRef(0);
    const [api_error_message, setApiErrorMessage] = React.useState('');
    const [has_more_items_to_load, setHasMoreItemsToLoad] = React.useState(false);
    const [is_loading, setIsLoading] = React.useState(true);
    const [items, setItems] = React.useState([]);
    const isMounted = useIsMounted();

    React.useEffect(() => {
        if (isMounted()) {
            loadMoreItems(item_offset.current, list_item_limit);
        }
    }, []);

    React.useEffect(() => {
        if (isMounted()) {
            setIsLoading(true);
            loadMoreItems(item_offset.current, list_item_limit);
        }
    }, [is_buy]);

    const loadMoreItems = start_idx => {
        return new Promise(resolve => {
            requestWS({
                p2p_advert_list: 1,
                counterparty_type: is_buy ? buy_sell.BUY : buy_sell.SELL,
                offset: start_idx,
                limit: list_item_limit,
            }).then(response => {
                if (isMounted()) {
                    if (!response.error) {
                        const { list } = response.p2p_advert_list;

                        setHasMoreItemsToLoad(list.length >= list_item_limit);
                        setItems(items.concat(list));
                        item_offset.current += list.length;
                    } else {
                        setApiErrorMessage(response.error.message);
                    }
                    setIsLoading(false);
                }
                resolve();
            });
        });
    };

    if (is_loading) {
        return <Loading is_fullscreen={false} />;
    }
    if (api_error_message) {
        return <TableError message={api_error_message} />;
    }

    const Row = props => (
        <RowComponent
            {...props}
            is_buy={is_buy}
            setSelectedAdvert={setSelectedAdvert}
            showAdvertiserPage={showAdvertiserPage}
        />
    );

    if (items.length) {
        const item_height = 56;
        const height_values = [
            height_constants.screen,
            height_constants.core_header,
            height_constants.page_overlay_header,
            height_constants.page_overlay_content_padding,
            height_constants.tabs,
            height_constants.filters,
            height_constants.filters_margin,
            height_constants.table_header,
            height_constants.core_footer,
        ];
        return (
            <BuySellTable>
                <InfiniteLoaderList
                    autosizer_height={`calc(${height_values.join(' - ')})`}
                    items={items}
                    item_size={item_height}
                    RenderComponent={Row}
                    RowLoader={BuySellRowLoader}
                    has_more_items_to_load={has_more_items_to_load}
                    loadMore={loadMoreItems}
                />
            </BuySellTable>
        );
    }

    return <Empty has_tabs icon='IcCashierNoAds' title={localize('No ads found')} />;
};

BuySellTableContent.propTypes = {
    is_buy: PropTypes.bool,
    setSelectedAdvert: PropTypes.func,
    showAdvertiserPage: PropTypes.func,
};

export default BuySellTableContent;
