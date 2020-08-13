import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { localize } from 'Components/i18next';
import Dp2pContext from 'Components/context/dp2p-context';
import PageReturn from 'Components/page-return/page-return.jsx';
import { subscribeWS } from 'Utils/websocket';
import OrderInfo from './order-info';
import OrderDetails from './order-details/order-details.jsx';
import OrderTable from './order-table/order-table.jsx';
import './orders.scss';

const Orders = ({ chat_info, navigate, params }) => {
    const { getLocalStorageSettingsForLoginId, order_id, setOrderId, updateP2pNotifications } = React.useContext(
        Dp2pContext
    );
    const [order_details, setDetails] = React.useState(null);
    const [nav, setNav] = React.useState(params?.nav);
    const is_mounted = React.useRef(false);
    const order_info_subscription = React.useRef(null);
    const hideDetails = () => {
        if (nav) {
            navigate(nav.location);
        }

        setDetails(null);
        setOrderId(null);
    };

    const getOrderDetails = () => {
        order_info_subscription.current = subscribeWS(
            {
                p2p_order_info: 1,
                id: order_id,
                subscribe: 1,
            },
            [setOrderDetails]
        );
    };

    const setOrderDetails = response => {
        if (!response.error) {
            setDetails(new OrderInfo(response));
        } else {
            order_info_subscription.current.unsubscribe();
        }
    };

    const setQueryDetails = input_order => {
        setOrderId(input_order.id);

        const { notifications } = getLocalStorageSettingsForLoginId();

        if (notifications.length) {
            const notification = notifications.find(n => n.order_id === input_order.id);

            if (notification) {
                notification.is_seen = true;
                updateP2pNotifications(notifications);
            }
        }
    };

    React.useEffect(() => {
        if (order_info_subscription.current) {
            order_info_subscription.current.unsubscribe();
        }
        if (order_id) {
            getOrderDetails(order_id);
        }
    }, [order_id]);

    React.useEffect(() => {
        setNav(params?.nav ?? nav);
    }, [params]);

    React.useEffect(() => {
        is_mounted.current = true;

        // Clear details when unmounting
        return () => {
            is_mounted.current = false;
            hideDetails();
        };
    }, []);

    return (
        <div className={classNames('orders', { 'orders--order-view': !!order_details })}>
            {order_details && (
                <React.Fragment>
                    <PageReturn
                        onClick={hideDetails}
                        page_title={
                            order_details.is_buyer
                                ? localize('Buy {{offered_currency}} order', {
                                      offered_currency: order_details.offer_currency,
                                  })
                                : localize('Sell {{offered_currency}} order', {
                                      offered_currency: order_details.offer_currency,
                                  })
                        }
                    />
                    <OrderDetails order_details={order_details} chat_info={chat_info} />
                </React.Fragment>
            )}
            {!order_details && <OrderTable navigate={navigate} showDetails={setQueryDetails} />}
        </div>
    );
};

Orders.propTypes = {
    chat_info: PropTypes.object,
    navigate: PropTypes.func,
    params: PropTypes.object,
};

export default Orders;
