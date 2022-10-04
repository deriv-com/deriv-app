import { toMoment } from '@deriv/shared';
import { localize } from 'Components/i18next';
import { convertToMillis, getFormattedDateString } from 'Utils/date-time';
import { buy_sell } from '../constants/buy-sell';

export default class ExtendedOrderDetails {
    constructor(order_details, loginid, server_time) {
        this.order_details = order_details;
        this.loginid = loginid;
        this.server_time = server_time;

        // Assign all original props to this.
        Object.keys(this.order_details).forEach(key => {
            this[key] = order_details[key];
        });
    }

    // Order statuses
    get is_buy_order() {
        return this.order_details.type === buy_sell.BUY;
    }
    get is_sell_order() {
        return this.order_details.type === buy_sell.SELL;
    }
    get is_buyer_cancelled_order() {
        return this.order_details.status === 'cancelled';
    }
    get is_buyer_confirmed_order() {
        return this.order_details.status === 'buyer-confirmed';
    }
    get is_completed_order() {
        return this.order_details.status === 'completed';
    }

    get is_disputed_order() {
        return this.order_details.status === 'disputed';
    }

    get is_dispute_refunded_order() {
        return this.order_details.status === 'dispute-refunded';
    }

    get is_dispute_completed_order() {
        return this.order_details.status === 'dispute-completed';
    }

    get is_expired_order() {
        return this.order_details.status === 'timed-out';
    }

    get is_incoming_order() {
        return !!this.order_details.is_incoming;
    }

    get is_pending_order() {
        return this.order_details.status === 'pending';
    }

    get is_refunded_order() {
        return this.order_details.status === 'refunded';
    }

    get is_my_ad() {
        return this.order_details?.advertiser_details?.loginid === this.loginid;
    }

    get is_inactive_order() {
        return (
            this.is_buyer_cancelled_order ||
            this.is_refunded_order ||
            this.is_completed_order ||
            this.is_dispute_completed_order ||
            this.is_dispute_refunded_order
        );
    }

    get is_active_order() {
        return !this.is_inactive_order;
    }

    get is_finalised_order() {
        return this.is_completed_order || this.is_buyer_cancelled_order || this.is_refunded_order;
    }

    get has_review_details() {
        return !!this.order_details?.review_details;
    }

    get is_order_reviewable() {
        return this.order_details.is_reviewable;
    }

    get is_user_rated_previously() {
        return this.is_buy_order_for_user
            ? this.order_details.advertiser_details?.is_recommended
            : this.order_details.client_details?.is_recommended;
    }

    get previous_recommendation() {
        return this.is_buy_order_for_user
            ? this.order_details.advertiser_details.is_recommended
            : this.order_details.client_details.is_recommended;
    }

    get rating() {
        return this.order_details?.review_details?.rating;
    }

    // A happening order describes an order where an action has been taken by either side, i.e.
    // one side confirmed they've paid or received funds.
    get is_ongoing_order() {
        return this.is_buyer_confirmed_order || this.is_buyer_cancelled_order;
    }

    get is_buy_order_for_user() {
        return (this.is_buy_order && !this.is_my_ad) || (this.is_sell_order && this.is_my_ad);
    }

    // This boolean is used to fix a backend feature where they will only
    // expire orders once a minute, as a result FE will incorrectly show
    // orders as active when they're actually expired. This boolean is used
    // as an extra check to ensure orders look expired on FE.
    get has_timer_expired() {
        const server_time_moment = this.server_time.get();
        const expiry_time_moment = toMoment(this.order_details.expiry_time);
        return server_time_moment.isAfter(expiry_time_moment);
    }

    get remaining_seconds() {
        const server_time_moment = this.server_time.get();
        const expiry_time_moment = toMoment(this.order_details.expiry_time);
        return expiry_time_moment.diff(server_time_moment, 'seconds');
    }

    get should_highlight_disabled() {
        return (
            this.is_buyer_cancelled_order ||
            this.is_expired_order ||
            this.is_refunded_order ||
            this.is_disputed_order ||
            this.is_dispute_refunded_order ||
            (this.has_timer_expired && !this.is_completed_order && !this.is_dispute_completed_order)
        );
    }

    get should_highlight_alert() {
        if (this.has_timer_expired) return false;

        if (this.is_my_ad) {
            return this.is_buy_order ? this.is_pending_order : this.is_buyer_confirmed_order;
        }

        return this.is_buy_order ? this.is_buyer_confirmed_order : this.is_pending_order;
    }

    get should_highlight_danger() {
        if (this.has_timer_expired) return false;

        if (this.is_my_ad) {
            return this.is_buy_order ? this.is_buyer_confirmed_order : this.is_pending_order;
        }

        return this.is_buy_order ? this.is_pending_order : this.is_buyer_confirmed_order;
    }

    get should_highlight_success() {
        return this.is_completed_order || this.is_dispute_completed_order;
    }

    get should_show_cancel_and_paid_button() {
        if (this.has_timer_expired) return false;

        if (this.is_buy_order) {
            return !this.is_my_ad && this.is_pending_order && this.is_active_order;
        }

        return this.is_my_ad && this.is_pending_order && this.is_active_order;
    }

    get should_show_complain_and_received_button() {
        if (this.is_finalised_order) return false;

        if (this.is_sell_order) {
            return (this.is_expired_order || (this.is_ongoing_order && this.has_timer_expired)) && !this.is_my_ad;
        }

        return (this.is_expired_order || (this.is_ongoing_order && this.has_timer_expired)) && this.is_my_ad;
    }

    // Only show the complain button for expired orders (determined by backend), or for orders
    // that are expired (determined by FE). This logic exists because BE only expires orders
    // once a minute rather than on expiry time. FE should expire orders so users cannot
    // execute actions such as "I've paid" or "I've received payment" on technically expired orders.
    get should_show_only_complain_button() {
        if (this.is_finalised_order) return false;

        if (this.is_sell_order) {
            return this.is_expired_order || (this.is_ongoing_order && this.has_timer_expired);
        }

        return (this.is_expired_order || (this.is_ongoing_order && this.has_timer_expired)) && !this.is_my_ad;
    }

    get should_show_only_received_button() {
        if (this.is_disputed_order) {
            return (!this.is_incoming_order && this.is_sell_order) || (this.is_incoming_order && this.is_buy_order);
        }

        if (this.is_buy_order) {
            return this.is_my_ad && this.is_buyer_confirmed_order;
        }

        return !this.is_my_ad && this.is_buyer_confirmed_order;
    }

    get should_show_order_footer() {
        return (
            this.should_show_cancel_and_paid_button ||
            this.should_show_complain_and_received_button ||
            this.should_show_only_complain_button ||
            this.should_show_only_received_button
        );
    }

    get should_show_order_timer() {
        if (this.is_finalised_order) return false;
        return this.is_pending_order || this.is_ongoing_order;
    }

    get should_show_lost_funds_banner() {
        return this.is_pending_order || this.is_buyer_confirmed_order;
    }

    get status_string() {
        // Finalised orders, should take precedence over is_expired_order/has_timer_expired.
        if (this.is_completed_order || this.is_dispute_completed_order) {
            return localize('Completed');
        }
        if (this.is_buyer_cancelled_order) {
            return localize('Cancelled');
        }
        if (this.is_refunded_order || this.is_dispute_refunded_order) {
            return localize('Expired');
        }

        if (this.is_disputed_order) {
            return localize('Under dispute');
        }

        // Keep this here, has_timer_expired should take priority over statuses below.
        if (this.is_expired_order || this.has_timer_expired) {
            return localize('Expired');
        }

        if (this.is_pending_order) {
            const wait_for_payment = localize('Wait for payment');
            const pay_now = localize('Pay now');

            if (this.is_my_ad) {
                return this.is_buy_order ? wait_for_payment : pay_now;
            }

            return this.is_buy_order ? pay_now : wait_for_payment;
        }

        if (this.is_buyer_confirmed_order) {
            const confirm_payment = localize('Confirm payment');
            const wait_for_release = localize('Waiting for the seller to confirm');

            if (this.is_my_ad) {
                return this.is_buy_order ? confirm_payment : wait_for_release;
            }

            return this.is_buy_order ? wait_for_release : confirm_payment;
        }

        return localize('Unknown');
    }

    get labels() {
        if (this.is_buy_order) {
            if (this.is_my_ad) {
                return {
                    counterparty_nickname_label: localize("Buyer's nickname"),
                    counterparty_real_name_label: localize("Buyer's real name"),
                    left_send_or_receive: localize('Receive'),
                    right_send_or_receive: localize('Send'),
                    payment_details: localize('Your payment details'),
                    contact_details: localize('Your contact details'),
                    instructions: localize('Your instructions'),
                    result_string: localize('You sold {{offered_amount}} {{offered_currency}}', {
                        offered_amount: this.order_details.amount_display,
                        offered_currency: this.order_details.account_currency,
                    }),
                };
            }

            return {
                counterparty_nickname_label: localize("Seller's nickname"),
                counterparty_real_name_label: localize("Seller's real name"),
                left_send_or_receive: localize('Send'),
                right_send_or_receive: localize('Receive'),
                payment_details: localize("Seller's payment details"),
                contact_details: localize("Seller's contact details"),
                instructions: localize("Seller's instructions"),
                result_string: localize("You've received {{offered_amount}} {{offered_currency}}", {
                    offered_amount: this.order_details.amount_display,
                    offered_currency: this.order_details.account_currency,
                }),
            };
        }

        // !this.is_buy_order
        if (this.is_my_ad) {
            return {
                counterparty_nickname_label: localize("Seller's nickname"),
                counterparty_real_name_label: localize("Seller's real name"),
                left_send_or_receive: localize('Send'),
                right_send_or_receive: localize('Receive'),
                payment_details: localize("Seller's payment details"),
                contact_details: localize("Seller's contact details"),
                instructions: localize('Your instructions'),
                result_string: localize("You've received {{offered_amount}} {{offered_currency}}", {
                    offered_amount: this.order_details.amount_display,
                    offered_currency: this.order_details.account_currency,
                }),
            };
        }

        return {
            counterparty_nickname_label: localize("Buyer's nickname"),
            counterparty_real_name_label: localize("Buyer's real name"),
            left_send_or_receive: localize('Receive'),
            right_send_or_receive: localize('Send'),
            payment_details: localize('Your payment details'),
            contact_details: localize('Your contact details'),
            instructions: localize("Buyer's instructions"),
            result_string: localize('You sold {{offered_amount}} {{offered_currency}}', {
                offered_amount: this.order_details.amount_display,
                offered_currency: this.order_details.account_currency,
            }),
        };
    }

    get my_user_details() {
        return this.is_my_ad ? this.order_details.advertiser_details : this.order_details.client_details;
    }

    get other_user_details() {
        return this.is_my_ad ? this.order_details.client_details : this.order_details.advertiser_details;
    }

    get order_expiry_milliseconds() {
        return convertToMillis(this.order_details.expiry_time);
    }

    get order_purchase_datetime() {
        return getFormattedDateString(new Date(convertToMillis(this.order_details.created_time)), true);
    }

    get purchase_time() {
        return getFormattedDateString(new Date(convertToMillis(this.order_details.created_time)), true);
    }
}

export const createExtendedOrderDetails = (order_details, loginid, server_time) =>
    new ExtendedOrderDetails(order_details, loginid, server_time);
