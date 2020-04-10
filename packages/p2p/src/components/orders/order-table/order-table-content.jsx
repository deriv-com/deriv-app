import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Loading } from '@deriv/components';
import { localize } from 'Components/i18next';
import { InfiniteLoaderList } from 'Components/table/infinite-loader-list.jsx';
import { TableError } from 'Components/table/table-error.jsx';
import { requestWS } from 'Utils/websocket';
import OrderInfo from '../order-info';
import { getModifiedP2POrderList } from '../../../utils/websocket.js';
import Dp2pContext from 'Components/context/dp2p-context';
import { BuySellRowLoader } from 'Components/buy-sell/row.jsx';
import BuyOrderRowComponent from './order-table-buy-row.jsx';
import SellOrderRowComponent from './order-table-sell-row.jsx';

const OrderTableContent = ({ showDetails }) => {
    const { order_limit, order_offset, orders, setOrders, setOrderOffset } = useContext(Dp2pContext);
    const [is_mounted, setIsMounted] = useState(false);
    const [has_more_items_to_load, setHasMoreItemsToLoad] = useState(false);
    const [api_error_message, setApiErrorMessage] = useState('');
    const [is_loading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    useEffect(() => {
        loadMoreOrders(order_offset);
    }, [is_mounted]);

    const loadMoreOrders = start_idx => {
        return new Promise(resolve => {
            requestWS({
                p2p_order_list: 1,
                offset: start_idx,
                limit: order_limit,
            }).then(response => {
                if (is_mounted) {
                    if (!response.error) {
                        const { list } = response.p2p_order_list;
                        setHasMoreItemsToLoad(list.length >= order_limit);
                        setIsLoading(false);
                        setOrders(orders.concat(getModifiedP2POrderList(list)));
                        setOrderOffset(order_offset + list.length);
                    } else {
                        setApiErrorMessage(response.api_error_message);
                    }
                    resolve();
                }
            });
        });
    };

    if (is_loading) {
        return <Loading is_fullscreen={false} />;
    }
    if (api_error_message) {
        return <TableError message={api_error_message} />;
    }

    const Row = row_props =>
        row_props.data.is_buyer ? (
            <BuyOrderRowComponent {...row_props} onOpenDetails={showDetails} />
        ) : (
            <SellOrderRowComponent {...row_props} onOpenDetails={showDetails} />
        );

    if (orders.length) {
        const modified_list = orders.map(list => new OrderInfo(list));
        return (
            <InfiniteLoaderList
                // screen size - header size - footer size - page overlay header - page overlay content padding -
                // tabs height - padding of tab content - table header height
                initial_height={'calc(100vh - 48px - 36px - 41px - 2.4rem - 36px - 2.4rem - 52px)'}
                items={modified_list}
                item_size={72}
                RenderComponent={Row}
                RowLoader={BuySellRowLoader}
                has_more_items_to_load={has_more_items_to_load}
                loadMore={loadMoreOrders}
            />
        );
    }

    return <div className='deriv-p2p__empty'>{localize(`You haven't made or received any orders yet.`)}</div>;
};

// OrderTableContent.propTypes = {
//     setSelectedAd: PropTypes.func,
// };

export default OrderTableContent;
