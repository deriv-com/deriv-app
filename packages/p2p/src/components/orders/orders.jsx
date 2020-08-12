import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { localize } from 'Components/i18next';
import Dp2pContext from 'Components/context/dp2p-context';
import PageReturn from 'Components/page-return/page-return.jsx';
import OrderInfo from './order-info';
import OrderDetails from './order-details/order-details.jsx';
import OrderTable from './order-table/order-table.jsx';
import './orders.scss';

const Orders = ({ params, navigate, chat_info }) => {
    const { orders, order_id, setOrderId, LocalStorage } = React.useContext(Dp2pContext);
    const [order_details, setDetails] = React.useState(null);
    const [nav, setNav] = React.useState(params?.nav);
    const is_mounted = React.useRef(false);
    const hideDetails = () => {
        if (nav) {
            navigate(nav.location);
        }
        setDetails(null);
        setOrderId(null);
    };

    const setQueryDetails = input_order => {
        setOrderId(input_order.id);
        setDetails(input_order);
        LocalStorage?.setNotificationByOrderId?.(input_order.id, {
            unread_msgs: 0,
            has_seen_order: true,
        });
    };

    React.useEffect(() => {
        setNav(params?.nav ?? nav);
    }, [params]);

    React.useEffect(() => {
        is_mounted.current = true;

        if (params && params.order_info) {
            const order_info = new OrderInfo(params.order_info);
            setQueryDetails(order_info);
        }
        // Clear details when unmounting
        return () => {
            is_mounted.current = false;
            hideDetails();
        };
    }, []);

    React.useEffect(() => {
        if (!is_mounted.current) return;

        if (orders.length && order_id) {
            const order_payload = orders.find(order => order.id === order_id);
            if (order_payload) {
                const order_info = new OrderInfo(order_payload);
                setQueryDetails(order_info);
            } else {
                navigate('orders');
            }
        }
        if (order_details) {
            const updated_order = orders.find(order => order.id === order_details.id);
            if (updated_order.status !== order_details.status) {
                const updated_order_info = new OrderInfo(updated_order);
                setQueryDetails(updated_order_info);
            }
        }
    }, [orders]);

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
