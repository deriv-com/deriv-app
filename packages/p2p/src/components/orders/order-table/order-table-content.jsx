import React from 'react';
import PropTypes from 'prop-types';
import { Loading, Button, InfiniteDataList } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { Localize, localize } from 'Components/i18next';
import { TableError } from 'Components/table/table-error.jsx';
import Dp2pContext from 'Components/context/dp2p-context';
import Empty from 'Components/empty/empty.jsx';
import OrderTableHeader from 'Components/orders/order-table/order-table-header.jsx';
import OrderRow from 'Components/orders/order-table/order-table-row.jsx';
import { useStores } from 'Stores';
import { createExtendedOrderDetails } from 'Utils/orders';
import { requestWS } from 'Utils/websocket';

const OrderTableContent = observer(({ showDetails, is_active }) => {
    const { general_store } = useStores();
    const { changeTab, is_active_tab, order_table_type } = React.useContext(Dp2pContext);
    const [orders, setOrders] = React.useState([]);
    const [api_error_message, setApiErrorMessage] = React.useState('');
    const [has_more_items_to_load, setHasMoreItemsToLoad] = React.useState(false);
    const [is_loading, setIsLoading] = React.useState(true);
    const isMounted = useIsMounted();

    React.useEffect(() => {
        if (isMounted()) {
            setIsLoading(true);
            loadMoreOrders({ startIndex: 0 });
        }
    }, [order_table_type]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadMoreOrders = ({ startIndex }) => {
        return new Promise(resolve => {
            requestWS({
                p2p_order_list: 1,
                active: is_active_tab ? 1 : 0,
                offset: startIndex,
                limit: general_store.list_item_limit,
            }).then(response => {
                if (isMounted()) {
                    if (!response.error) {
                        const { list } = response.p2p_order_list;
                        setHasMoreItemsToLoad(list.length >= general_store.list_item_limit);
                        setOrders(orders.concat(list));
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

    const OrderRowRenderer = row_props => <OrderRow {...row_props} onOpenDetails={showDetails} is_active={is_active} />;

    if (orders.length) {
        const { client, props } = general_store;
        const modified_list = orders
            .map(order => createExtendedOrderDetails(order, client.loginid, props.server_time))
            .filter(order => (is_active ? order.is_active_order : order.is_inactive_order));

        if (modified_list.length) {
            return (
                <OrderTableHeader is_active={is_active}>
                    <InfiniteDataList
                        data_list_className='orders__data-list'
                        has_more_items_to_load={has_more_items_to_load}
                        items={modified_list}
                        keyMapperFn={item => item.id}
                        loadMoreRowsFn={loadMoreOrders}
                        rowRenderer={OrderRowRenderer}
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
