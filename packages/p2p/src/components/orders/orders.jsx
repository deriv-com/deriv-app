import React from 'react';
import PropTypes from 'prop-types';
import { useIsMounted } from '@deriv/shared';
import { localize } from 'Components/i18next';
import Dp2pContext from 'Components/context/dp2p-context';
import PageReturn from 'Components/page-return/page-return.jsx';
import { useStores } from 'Stores';
import { getExtendedOrderDetails } from 'Utils/orders';
import { subscribeWS } from 'Utils/websocket';
import OrderDetails from './order-details/order-details.jsx';
import OrderTable from './order-table/order-table.jsx';
import './orders.scss';

const Orders = ({ params, navigate, chat_info }) => {
    const { general_store } = useStores();
    const isMounted = useIsMounted();
    const {
        getLocalStorageSettingsForLoginId,
        order_id,
        orders,
        setOrderId,
        updateP2pNotifications,
    } = React.useContext(Dp2pContext);
    const [order_information, setOrderInformation] = React.useState(null);
    const [nav, setNav] = React.useState(params?.nav);
    const order_info_subscription = React.useRef(null);

    const hideDetails = should_navigate => {
        if (should_navigate && nav) {
            navigate(nav.location);
        }
        setOrderId(null);
        setOrderInformation(null);
    };

    const subscribeToCurrentOrder = () => {
        order_info_subscription.current = subscribeWS(
            {
                p2p_order_info: 1,
                id: order_id,
                subscribe: 1,
            },
            [setOrderDetails]
        );
    };

    const unsubscribeFromCurrentOrder = () => {
        if (order_info_subscription.current?.unsubscribe) {
            order_info_subscription.current.unsubscribe();
        }
    };

    const setOrderDetails = response => {
        if (!response.error) {
            const { p2p_order_info } = response;
            setQueryDetails(p2p_order_info);
        } else {
            unsubscribeFromCurrentOrder();
        }
    };

    const setQueryDetails = input_order => {
        const input_order_information = getExtendedOrderDetails(input_order, general_store.client.loginid);

        setOrderId(input_order_information.id); // Sets the id in URL
        setOrderInformation(input_order_information);

        // When viewing specific order, update its read state in localStorage.
        const { notifications } = getLocalStorageSettingsForLoginId();

        if (notifications.length) {
            const notification = notifications.find(n => n.order_id === input_order_information.id);

            if (notification) {
                notification.is_seen = true;
                updateP2pNotifications(notifications);
            }
        }
    };

    React.useEffect(() => {
        return () => {
            unsubscribeFromCurrentOrder();
            hideDetails(false);
        };
    }, []);

    React.useEffect(() => {
        unsubscribeFromCurrentOrder();

        if (order_id) {
            subscribeToCurrentOrder();
        }
    }, [order_id]);

    React.useEffect(() => {
        setNav(params?.nav ?? nav);
    }, [params]);

    React.useEffect(() => {
        if (isMounted() && order_id) {
            // If orders was updated, find current viewed order (if any)
            // and trigger a re-render (in case status was updated).
            const order = orders.find(o => o.id === order_id);

            if (order) {
                setQueryDetails(order);
            } else {
                navigate('orders');
            }
        }
    }, [orders]);

    if (order_information) {
        const { account_currency } = order_information;
        return (
            <div className='orders orders--order-view'>
                <PageReturn
                    onClick={() => hideDetails(true)}
                    page_title={
                        (order_information.is_buy_order && !order_information.is_my_ad) ||
                        (order_information.is_sell_order && order_information.is_my_ad)
                            ? localize('Buy {{offered_currency}} order', { offered_currency: account_currency })
                            : localize('Sell {{offered_currency}} order', { offered_currency: account_currency })
                    }
                />
                <OrderDetails order_information={order_information} chat_info={chat_info} />
            </div>
        );
    }

    return (
        <div className='orders'>
            <OrderTable navigate={navigate} showDetails={setQueryDetails} />
        </div>
    );
};

Orders.propTypes = {
    chat_info: PropTypes.object,
    navigate: PropTypes.func,
    params: PropTypes.object,
};

export default Orders;
