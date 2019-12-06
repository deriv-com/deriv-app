import React                   from 'react';
import { localize }            from 'deriv-translations';
import PageReturn              from 'Components/page-return/page-return.jsx';
import { millisecondsToTimer } from 'Utils/date-time';
import OrderDetails            from  './order-details/order-details.jsx';
import './orders.scss';

class OrderDeets {
    order_id = 'ABC123';
    status = 'pending';
    type = 'buy';
    advertiser_notes = 'Hello I am watermelon';
    order_purchase_datetime = new Date();
    other_party = 'John Doe';
    price_rate = 2000000;
    display_price_rate = '2,000,000.00';
    offer_currency = 'BTC'; // The currency that is being purchased
    transaction_currency = 'IDR'; // The currency that is used to purchase the selling currency
    display_offer_amount = '0.002931';
    display_transaction_amount = '100,000.00';
    offer_amount = 0.002931;
    transaction_amount = 100000;
    remaining_time = 3600000; // 60 * 60 * 1000
    remainingTimeInterval = null;

    constructor() {
        this.remainingTimeInterval = setInterval(() => {
            if (this.remaining_time !== 0) {
                this.remaining_time -= 1000;
            } else {
                // TODO: [timeout-status-check] - Check if order has timed out; add timeout message to `OrderDetails`
                clearInterval(this.remainingTimeInterval);
                this.remainingTimeInterval = null;
            }
        }, 1000);
    }

    get is_buyer() {
        return this.type === 'buy';
    }

    get is_pending() {
        return this.status === 'pending';
    }

    get is_buyer_confirmed() {
        return this.status === 'confirmed-client';
    }

    get is_buyer_cancelled() {
        return this.status === 'cancelled-client';
    }

    get is_expired() {
        return this.status === 'expired';
    }

    get is_seller_confirmed() {
        return this.status === 'complete';
    }

    get display_remaining_time() {
        return millisecondsToTimer(this.remaining_time);
    }
}

const Orders = () => {
    const my_deets = new OrderDeets();
    const [order_details, setDetails] = React.useState(my_deets);
    const toggleDetails = () => order_details && order_details.order_id ? setDetails(null) : setDetails(my_deets);

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
