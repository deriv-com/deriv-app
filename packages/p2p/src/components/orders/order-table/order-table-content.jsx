import React from 'react';
import PropTypes from 'prop-types';
import { Loading, Button } from '@deriv/components';
import { Localize, localize } from 'Components/i18next';
import { TableError } from 'Components/table/table-error.jsx';
import { InfiniteLoaderList } from 'Components/table/infinite-loader-list.jsx';
import { requestWS, getModifiedP2POrderList } from 'Utils/websocket';
import Dp2pContext from 'Components/context/dp2p-context';
import Empty from 'Components/empty/empty.jsx';
import OrderTableHeader from 'Components/orders/order-table/order-table-header.jsx';
import OrderRowComponent from 'Components/orders/order-table/order-table-row.jsx';
import OrderInfo from 'Components/orders/order-info';
import { height_constants } from 'Utils/height_constants';

const OrderTableContent = ({ showDetails, is_active }) => {
    const { changeTab, handleNotifications, list_item_limit, order_table_type } = React.useContext(Dp2pContext);

    const [api_error_message, setApiErrorMessage] = React.useState('');
    const [has_more_items_to_load, setHasMoreItemsToLoad] = React.useState(false);
    const is_active_tab = React.useRef(true);
    const [is_loading, setIsLoading] = React.useState(true);
    const [is_mounted, setIsMounted] = React.useState(false);
    const order_offset = React.useRef(0);
    const [orders, setOrders] = React.useState([]);

    React.useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    React.useEffect(() => {
        if (is_mounted) {
            is_active_tab.current = order_table_type === 'active';
            order_offset.current = 0;
            setOrders([]);
            setIsLoading(true);
            loadMoreOrders();
        }
    }, [is_mounted, order_table_type]);

    const loadMoreOrders = () => {
        return new Promise(resolve => {
            requestWS({
                p2p_order_list: 1,
                offset: order_offset.current,
                limit: list_item_limit,
                active: is_active_tab.current ? 1 : 0,
            }).then(response => {
                if (is_mounted) {
                    const { list } = response.p2p_order_list;
                    if (list) {
                        if (!list.error) {
                            setHasMoreItemsToLoad(list.length >= list_item_limit);
                            handleNotifications(orders, list);
                            setOrders(orders.concat(getModifiedP2POrderList(list)));
                            order_offset.current += list.length;
                            setIsLoading(false);
                        } else {
                            setApiErrorMessage(list.error.message);
                        }
                    } else {
                        // it's a single order from p2p_order_info
                        const idx_order_to_update = orders.findIndex(order => order.id === response.id);
                        const updated_orders = [...orders];
                        // if it's a new order, add it to the top of the list
                        if (idx_order_to_update < 0) {
                            updated_orders.unshift(response);
                        } else {
                            // otherwise, update the correct order
                            updated_orders[idx_order_to_update] = response;
                        }
                        // trigger re-rendering by setting orders again
                        handleNotifications(orders, updated_orders);
                        setOrders(getModifiedP2POrderList(updated_orders));
                    }
                    setIsLoading(false);
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

    const Row = row_props => <OrderRowComponent {...row_props} onOpenDetails={showDetails} is_active={is_active} />;

    if (orders.length) {
        const modified_list = orders
            .map(list => new OrderInfo(list))
            .filter(order => (is_active ? order.is_active : order.is_inactive));
        const item_height = 72;
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
        if (modified_list.length) {
            return (
                <OrderTableHeader is_active={is_active}>
                    <InfiniteLoaderList
                        autosizer_height={`calc(${height_values.join(' - ')})`}
                        items={modified_list}
                        item_size={item_height}
                        RenderComponent={Row}
                        // RowLoader={OrderRowLoader}
                        has_more_items_to_load={has_more_items_to_load}
                        loadMore={loadMoreOrders}
                    />
                </OrderTableHeader>
            );
        }
    }

    return (
        <Empty has_tabs icon='IcNoOrder' title={localize('You have no orders')}>
            {is_active && (
                <Button primary large className='p2p-empty__button' onClick={() => changeTab(0)}>
                    <Localize i18n_default_text='Buy/Sell' />
                </Button>
            )}
        </Empty>
    );
};

OrderTableContent.propTypes = {
    is_active: PropTypes.bool,
    showDetails: PropTypes.func,
};

export default OrderTableContent;
