import React from 'react';
import { localize } from 'Components/i18next';
import PageReturn from 'Components/page-return/page-return.jsx';
import OrderDetails from './order-details/order-details.jsx';
import OrderInfo from './order-info';
import OrderTable from './order-table/order-table.jsx';
import './orders.scss';

const Orders = ({ orders, params }) => {
    const [order_details, setDetails] = React.useState(null);
    const showDetails = setDetails;
    const hideDetails = () => setDetails(null);

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
            const updated_order = orders.find(order => order.order_id === order_details.order_id);
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
                    <OrderDetails order_details={order_details} />
                </React.Fragment>
            )}
            {!order_details && <OrderTable orders={orders} showDetails={showDetails} />}
        </div>
    );
};

export default Orders;
