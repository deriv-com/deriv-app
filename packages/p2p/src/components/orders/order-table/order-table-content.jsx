import React from 'react';
import PropTypes from 'prop-types';
import { Loading, Button } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { Localize, localize } from 'Components/i18next';
import { TableError } from 'Components/table/table-error.jsx';
import { InfiniteLoaderList } from 'Components/table/infinite-loader-list.jsx';
import Dp2pContext from 'Components/context/dp2p-context';
import Empty from 'Components/empty/empty.jsx';
import OrderTableHeader from 'Components/orders/order-table/order-table-header.jsx';
import OrderRowComponent from 'Components/orders/order-table/order-table-row.jsx';
import { useStores } from 'Stores';
import { height_constants } from 'Utils/height_constants';
import { createExtendedOrderDetails } from 'Utils/orders';
import { requestWS } from 'Utils/websocket';

const OrderTableContent = observer(({ showDetails, is_active }) => {
    const { general_store } = useStores();
    const {
        changeTab,
        is_active_tab,
        list_item_limit,
        order_offset,
        order_table_type,
        orders,
        setOrderOffset,
        setOrders,
    } = React.useContext(Dp2pContext);

    const [api_error_message, setApiErrorMessage] = React.useState('');
    const [has_more_items_to_load, setHasMoreItemsToLoad] = React.useState(false);
    const [is_loading, setIsLoading] = React.useState(true);
    const isMounted = useIsMounted();

    React.useEffect(() => {
        if (isMounted()) {
            setIsLoading(true);
            loadMoreOrders();
        }
    }, [order_table_type]);

    const loadMoreOrders = () => {
        return new Promise(resolve => {
            requestWS({
                p2p_order_list: 1,
                offset: order_offset,
                limit: list_item_limit,
                active: is_active_tab ? 1 : 0,
            }).then(response => {
                if (isMounted()) {
                    if (!response.error) {
                        const { list } = response.p2p_order_list;
                        setHasMoreItemsToLoad(list.length >= list_item_limit);
                        setOrders(orders.concat(list));
                        setOrderOffset(order_offset + list.length);
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

    const Row = row_props => <OrderRowComponent {...row_props} onOpenDetails={showDetails} is_active={is_active} />;

    if (orders.length) {
        const { client, props } = general_store;
        const modified_list = orders
            .map(order => createExtendedOrderDetails(order, client.loginid, props.server_time))
            .filter(order => (is_active ? order.is_active_order : order.is_inactive_order));

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
});

OrderTableContent.propTypes = {
    is_active: PropTypes.bool,
    showDetails: PropTypes.func,
};

export default OrderTableContent;
