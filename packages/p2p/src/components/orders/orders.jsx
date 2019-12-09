import React        from 'react';
import { localize } from '../i18next';
import PageReturn   from 'Components/page-return/page-return.jsx';
import OrderDetails from './order-details/order-details.jsx';
import OrderInfo    from './order-info';
import './orders.scss';

const Orders = () => {
    const order_info = new OrderInfo();
    const [order_details, setDetails] = React.useState(order_info);
    // TODO: [p2p-replace-with-api] - remove these dev toggle once data fetch works
    const toggleDetails = () => order_details && order_details.order_id ? setDetails(null) : setDetails(order_info);

    return (
        <div className='orders'>
            { order_details && order_details.order_id &&
                <React.Fragment>
                    <PageReturn
                        onClick={ toggleDetails }
                        page_title={
                            order_details.is_buyer ?
                                localize('Buy {{offered_currency}} order', { offered_currency: order_details.offer_currency })
                                :
                                localize('Sell {{offered_currency}} order', { offered_currency: order_details.offer_currency })
                        }
                    />
                    <OrderDetails
                        order_details={ order_details }
                    />
                </React.Fragment>
            }
        </div>
    );
};

export default Orders;
