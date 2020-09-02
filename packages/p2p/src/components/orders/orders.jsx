import React from 'react';
import PropTypes from 'prop-types';
import { localize } from 'Components/i18next';
import Dp2pContext from 'Components/context/dp2p-context';
import PageReturn from 'Components/page-return/page-return.jsx';
import { getExtendedOrderDetails } from 'Utils/orders';
import OrderDetails from './order-details/order-details.jsx';
import OrderTable from './order-table/order-table.jsx';
import './orders.scss';

const Orders = ({ params, navigate, chat_info }) => {
    const {
        getLocalStorageSettingsForLoginId,
        loginid,
        order_id,
        orders,
        setOrderId,
        updateP2pNotifications,
    } = React.useContext(Dp2pContext);
    const [order_information, setOrderInformation] = React.useState(null);
    const [nav, setNav] = React.useState(params?.nav);
    const is_mounted = React.useRef(false);

    const hideDetails = () => {
        if (nav) {
            navigate(nav.location);
        }
        setOrderId(null);
        setOrderInformation(null);
    };

    const setQueryDetails = input_order => {
        const order_information = getExtendedOrderDetails(input_order, loginid);

        setOrderId(order_information.id); // Sets the id in URL
        setOrderInformation(order_information);

        // When viewing specific order, update its read state in localStorage.
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
        is_mounted.current = true;

        if (params?.order_info) {
            setQueryDetails(params.order_info);
        }
        // Clear details when unmounting
        return () => {
            hideDetails();
            is_mounted.current = false;
        };
    }, []);

    React.useEffect(() => {
        setNav(params?.nav ?? nav);
    }, [params]);

    React.useEffect(() => {
        if (!is_mounted.current) return;

        // If orders was updated, find current viewed order (if any)
        // and trigger a re-render (in case status was updated).
        if (order_id) {
            const order = orders.find(order => order.id === order_id);

            if (order) {
                setQueryDetails(order);
            } else {
                navigate('orders');
            }
        }
    }, [orders]);

    if (!!order_information) {
        const { offered_currency } = order_information;

        return (
            <div className='orders orders--order-view'>
                <PageReturn
                    onClick={hideDetails}
                    page_title={
                        order_information.is_buy_ad
                            ? localize('Buy {{offered_currency}} order', { offered_currency })
                            : localize('Sell {{offered_currency}} order', { offered_currency })
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
