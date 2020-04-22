import { localize } from 'Components/i18next';

export default class OrderInfo {
    id = '';
    status;
    type = '';
    advertiser_name = '';
    advertiser_notes = '';
    order_purchase_datetime = '';
    price_rate = 0;
    display_price_rate = '';
    offer_currency = ''; // The currency that is being purchased
    transaction_currency = ''; // The currency that is used to purchase the selling currency
    display_offer_amount = '';
    display_transaction_amount = '';
    offer_amount = 0;
    transaction_amount = 0;
    order_expiry_millis = 0;

    constructor(order_info = null) {
        if (order_info) {
            Object.keys(order_info).forEach(detail => {
                this[detail] = order_info[detail];
            });
        }
    }

    static status_map_buyer = {
        pending: localize('Please pay'),
        'buyer-confirmed': localize('Wait for release'),
    };

    static status_map_seller = {
        pending: localize('Wait for payment'),
        'buyer-confirmed': localize('Confirm payment'),
    };

    static status_map_common = {
        cancelled: localize('Cancelled'),
        'timed-out': localize('Cancelled'),
        refunded: localize('Refunded'),
        completed: localize('Completed'),
    };

    get display_status() {
        if (this.is_buyer && this.status in OrderInfo.status_map_buyer) {
            return OrderInfo.status_map_buyer[this.status];
        }
        if (!this.is_buyer && this.status in OrderInfo.status_map_seller) {
            return OrderInfo.status_map_seller[this.status];
        }
        return OrderInfo.status_map_common[this.status];
    }

    get is_buyer() {
        return this.type === 'buy';
    }

    get is_pending() {
        return this.status === 'pending';
    }

    get is_buyer_confirmed() {
        return this.status === 'buyer-confirmed';
    }

    get is_buyer_cancelled() {
        return this.status === 'cancelled';
    }

    get is_expired() {
        return this.status === 'timed-out';
    }

    get is_refunded() {
        return this.status === 'refunded';
    }

    get is_completed() {
        return this.status === 'completed';
    }

    setStatus = value => {
        this.status = value;
    };
}
