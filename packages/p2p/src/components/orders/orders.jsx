import React from 'react';
import { localize } from 'Components/i18next';
import Dp2pContext from 'Components/context/dp2p-context';
import PageReturn from 'Components/page-return/page-return.jsx';
import OrderInfo from './order-info';
import OrderDetails from './order-details/order-details.jsx';
import OrderTable from './order-table/order-table.jsx';
import './orders.scss';

const Orders = ({ navigate, params, chat_info }) => {
    const { orders } = React.useContext(Dp2pContext);
    const [order_details, setDetails] = React.useState(null);
    const [nav, setNav] = React.useState(params?.nav);
    const showDetails = setDetails;
    const hideDetails = () => {
        if (nav) {
            navigate(nav.location);
        }
        setDetails(null);
    };
    React.useEffect(() => {
        setNav(params?.nav ?? nav);
    }, [params]);

    React.useEffect(() => {
        if (params && params.order_info) {
            const order_info = new OrderInfo(params.order_info);
            setDetails(order_info);
        }

        // Clear details when unmounting
        return () => {
            setDetails(null);
        };
    }, []);

    React.useEffect(() => {
        if (order_details) {
            const updated_order = orders.find(order => order.id === order_details.id);
            if (updated_order.status !== order_details.status) {
                const updated_order_info = new OrderInfo(updated_order);
                setDetails(updated_order_info);
            }
        }
    }, [orders]);

    return (
        <div className='orders'>
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
            {!order_details && <OrderTable navigate={navigate} showDetails={showDetails} />}
        </div>
    );
};

export default Orders;
