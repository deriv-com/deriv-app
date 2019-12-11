import { localize }            from 'Components/i18next';
import { millisecondsToTimer } from 'Utils/date-time';

export default class OrderInfo {
    order_id = '';
    status = '';
    type = '';
    advertiser_notes = '';
    order_purchase_datetime = new Date();
    counterparty = '';
    price_rate = 0;
    display_price_rate = '';
    offer_currency = ''; // The currency that is being purchased
    transaction_currency = ''; // The currency that is used to purchase the selling currency
    display_offer_amount = '';
    display_transaction_amount = '';
    offer_amount = 0;
    transaction_amount = 0;
    remaining_time = 0; // 60 * 60 * 1000
    remainingTimeInterval = null;

    constructor(order_info = null) {
        if (order_info) {
            Object.keys(order_info).forEach(detail => {
                this[detail] = order_info[detail];
            })
        }

        this.remainingTimeInterval = setInterval(() => {
            if (this.remaining_time !== 0) {
                this.remaining_time -= 1000;
            } else {
                // TODO: [p2p-timeout-status-check] - Check if order has timed out; add timeout message to `OrderDetails`
                clearInterval(this.remainingTimeInterval);
                this.remainingTimeInterval = null;
            }
        }, 1000);
    }

    static status_map = {
        'pending'         : localize('Unpaid'),
        'confirmed-client': localize('Paid'),
        'cancelled-client': localize('Cancelled'),
        'expired'         : localize('Cancelled'),
        'complete'        : localize('Complete'),
    };

    get display_status() {
        return OrderInfo.status_map[this.status];
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
