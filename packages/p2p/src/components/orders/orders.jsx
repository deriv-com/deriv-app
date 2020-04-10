import React from 'react';
import { localize } from 'Components/i18next';
import PageReturn from 'Components/page-return/page-return.jsx';
import OrderDetails from './order-details/order-details.jsx';
import OrderInfo from './order-info';
import OrderTable from './order-table/order-table.jsx';
import './orders.scss';

const Orders = ({ orders, params }) => {
    const [order_details, setDetails] = React.useState(null);
    const [order_id, setOrderId] = React.useState('');
    const hideDetails = () => setDetails(null);

    const setQueryDetails = input_order => {
        // Changing query params
        const new_url = `${window.location.protocol}//${window.location.host}${window.location.pathname}?order=${input_order.id}${window.location.hash}`;
        window.history.pushState({ path: new_url }, '', new_url);

        setDetails(input_order);
    };

    React.useEffect(() => {
        if (params && params.order_info) {
            const order_info = new OrderInfo(params.order_info);
            setQueryDetails(order_info);
        }
        if (params && params.order_id) {
            setOrderId(params.order_id);
        }

        // Clear details when unmounting
        return () => {
            hideDetails();
        };
    }, []);

    React.useEffect(() => {
        if (orders.length && order_id) {
            const order_payload = orders.find(order => order.id === order_id);
            setQueryDetails(order_payload);
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
                    <OrderDetails order_details={order_details} />
                </React.Fragment>
            )}
            {!order_details && <OrderTable orders={orders} showDetails={setQueryDetails} />}
        </div>
    );
};

export default Orders;
