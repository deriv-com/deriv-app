import { localize } from 'Components/i18next';
import { convertToMillis, getFormattedDateString } from 'Utils/date-time';

const getPaymentMethodsMap = () => ({
    bank_transfer: localize('Bank transfer'),
});

export const getExtendedOrderDetails = (order_details, loginid) => {
    const is_buy_ad = order_details.type === 'buy';
    const is_buyer_cancelled_order = order_details.status === 'cancelled';
    const is_buyer_confirmed_order = order_details.status === 'buyer-confirmed';
    const is_completed_order = order_details.status === 'completed';
    const is_expired_order = order_details.status === 'timed-out';
    const is_my_ad = loginid === order_details.advertiser_details.loginid;
    const is_pending_order = order_details.status === 'pending';
    const is_refunded_order = order_details.status === 'refunded';
    const is_sell_ad = order_details.type === 'sell';

    const is_active_order = is_pending_order || is_buyer_confirmed_order || is_expired_order;
    const is_inactive_order = is_buyer_cancelled_order || is_refunded_order || is_completed_order;

    const should_highlight_alert = (is_buy_ad && is_buyer_confirmed_order) || (!is_buy_ad && is_pending_order);
    const should_highlight_danger = (is_buy_ad && is_pending_order) || (!is_buy_ad && is_buyer_confirmed_order);

    // Order details footer
    let should_show_cancel_and_paid_button;
    let should_show_complain_and_received_button;
    let should_show_only_complain_button;

    if (is_buy_ad) {
        should_show_cancel_and_paid_button = !is_my_ad && is_pending_order;
        should_show_complain_and_received_button = is_my_ad && (is_buyer_confirmed_order || is_expired_order);
        should_show_only_complain_button = is_expired_order || is_buyer_confirmed_order;
    }

    if (is_sell_ad) {
        should_show_cancel_and_paid_button = is_my_ad && is_pending_order;
        should_show_complain_and_received_button = !is_my_ad && (is_buyer_confirmed_order || is_expired_order);
        should_show_only_complain_button = is_expired_order || is_buyer_confirmed_order;
    }

    const should_show_order_footer =
        should_show_cancel_and_paid_button ||
        should_show_complain_and_received_button ||
        should_show_only_complain_button;

    // Order details status_string
    let status_string;
    if (is_pending_order) {
        if (is_my_ad) {
            status_string = is_buy_ad ? localize('Wait for payment') : localize('Pay now');
        } else {
            status_string = is_buy_ad ? localize('Pay now') : localize('Wait for payment');
        }
    } else if (is_buyer_cancelled_order) {
        status_string = localize('Cancelled');
    } else if (is_buyer_confirmed_order) {
        if (is_my_ad) {
            status_string = is_buy_ad ? localize('Confirm payment') : localize('Wait for release');
        } else {
            status_string = is_buy_ad ? localize('Wait for release') : localize('Confirm payment');
        }
    } else if (is_expired_order || is_refunded_order) {
        status_string = localize('Expired');
    } else if (is_completed_order) {
        status_string = localize('Completed');
    } else {
        status_string = localize('Unknown');
    }

    // Party information 🎉
    const my_user_details = is_my_ad ? order_details.advertiser_details : order_details.client_details;
    const other_user_details = is_my_ad ? order_details.client_details : order_details.advertiser_details;

    // Extra transformations
    const order_expiry_milliseconds = convertToMillis(order_details.expiry_time);
    const order_purchase_datetime = getFormattedDateString(new Date(convertToMillis(order_details.created_time)));
    const payment_method_display =
        getPaymentMethodsMap()[order_details.advert_details.payment_method] || localize('Unknown');
    const purchase_time = getFormattedDateString(new Date(convertToMillis(order_details.created_time)));

    // Labels to show on Order Details page, note: take into consideration both
    // ad type and whether the ad is from current user.
    const labels = {};
    if (is_buy_ad) {
        if (is_my_ad) {
            labels.other_party_role = localize('Buyer');
            labels.left_send_or_receive = localize('Receive');
            labels.right_send_or_receive = localize('Send');
            labels.payment_details = localize('Your payment details');
            labels.contact_details = localize('Your contact details');
            labels.instructions = localize('Your instructions');
            labels.result_string = localize('You sold {{offered_amount}} {{offered_currency}}', {
                offered_amount: order_details.amount_display,
                offered_currency: order_details.account_currency,
            });
        } else {
            labels.other_party_role = localize('Seller');
            labels.left_send_or_receive = localize('Send');
            labels.right_send_or_receive = localize('Receive');
            labels.payment_details = localize("Seller's payment details");
            labels.contact_details = localize("Seller's contact details");
            labels.instructions = localize("Seller's instructions");
            labels.result_string = localize("You've received {{offered_amount}} {{offered_currency}}", {
                offered_amount: order_details.amount_display,
                offered_currency: order_details.account_currency,
            });
        }
    }
    if (is_sell_ad) {
        if (is_my_ad) {
            labels.other_party_role = localize('Seller');
            labels.left_send_or_receive = localize('Send');
            labels.right_send_or_receive = localize('Receive');
            labels.payment_details = localize("Seller's payment details");
            labels.contact_details = localize("Seller's contact details");
            labels.instructions = localize('Your instructions');
            labels.result_string = localize("You've received {{offered_amount}} {{offered_currency}}", {
                offered_amount: order_details.amount_display,
                offered_currency: order_details.account_currency,
            });
        } else {
            labels.other_party_role = localize('Buyer');
            labels.left_send_or_receive = localize('Receive');
            labels.right_send_or_receive = localize('Send');
            labels.payment_details = localize('Your payment details');
            labels.contact_details = localize('Your contact details');
            labels.instructions = localize("Buyer's instructions");
            labels.result_string = localize('You sold {{offered_amount}} {{offered_currency}}', {
                offered_amount: order_details.amount_display,
                offered_currency: order_details.account_currency,
            });
        }
    }

    return {
        ...order_details,
        is_active_order,
        is_buy_ad,
        is_buyer_cancelled_order,
        is_buyer_confirmed_order,
        is_completed_order,
        is_expired_order,
        is_inactive_order,
        is_my_ad,
        is_pending_order,
        is_refunded_order,
        is_sell_ad,
        labels,
        my_user_details,
        order_expiry_milliseconds,
        order_purchase_datetime,
        other_user_details,
        payment_method_display,
        purchase_time,
        should_highlight_alert,
        should_highlight_danger,
        should_show_cancel_and_paid_button,
        should_show_complain_and_received_button,
        should_show_order_footer,
        should_show_only_complain_button,
        status_string,
    };
};
