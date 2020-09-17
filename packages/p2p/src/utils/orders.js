import { localize } from 'Components/i18next';
import { convertToMillis, getFormattedDateString } from 'Utils/date-time';

const getPaymentMethodsMap = () => ({
    bank_transfer: localize('Bank transfer'),
});

const getOrderLabels = (is_my_ad, is_buy_order, order_details) => {
    const labels = {};

    if (is_buy_order) {
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
    } else if (is_my_ad) {
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

    return labels;
};

export const getExtendedOrderDetails = (order_details, loginid) => {
    if (!loginid) {
        throw new Error('Missing required loginid');
    }

    const { advert_details, advertiser_details, client_details, status, type } = order_details;

    const is_buy_order = type === 'buy';
    const is_sell_order = type === 'sell';

    const is_buyer_cancelled_order = status === 'cancelled';
    const is_buyer_confirmed_order = status === 'buyer-confirmed';
    const is_completed_order = status === 'completed';
    const is_expired_order = status === 'timed-out';
    const is_pending_order = status === 'pending';
    const is_refunded_order = status === 'refunded';

    const is_my_ad = loginid === advertiser_details.loginid;

    const is_active_order = is_pending_order || is_buyer_confirmed_order || is_expired_order;
    const is_inactive_order = is_buyer_cancelled_order || is_refunded_order || is_completed_order;

    // Status highlighting (alert = yellow, danger = red, disabled = grey)
    let should_highlight_alert, should_highlight_danger;
    const should_highlight_disabled = is_buyer_cancelled_order || is_expired_order || is_refunded_order;

    if (is_my_ad) {
        if (is_buy_order) {
            should_highlight_alert = is_pending_order;
            should_highlight_danger = is_buyer_confirmed_order;
        } else {
            should_highlight_alert = is_buyer_confirmed_order;
            should_highlight_danger = is_pending_order;
        }
    } else {
        if (is_buy_order) {
            should_highlight_alert = is_buyer_confirmed_order;
            should_highlight_danger = is_pending_order;
        } else {
            should_highlight_alert = is_pending_order;
            should_highlight_danger = is_buyer_confirmed_order;
        }
    }

    // Order details footer.
    let should_show_cancel_and_paid_button, should_show_complain_and_received_button, status_string;

    if (is_buy_order) {
        should_show_cancel_and_paid_button = !is_my_ad && is_pending_order;
        should_show_complain_and_received_button = is_my_ad && (is_buyer_confirmed_order || is_expired_order);
    } else {
        should_show_cancel_and_paid_button = is_my_ad && is_pending_order;
        should_show_complain_and_received_button = !is_my_ad && (is_buyer_confirmed_order || is_expired_order);
    }

    const should_show_only_complain_button = is_expired_order;

    const should_show_order_footer =
        should_show_cancel_and_paid_button ||
        should_show_complain_and_received_button ||
        should_show_only_complain_button;

    if (is_pending_order) {
        if (is_my_ad) {
            status_string = is_buy_order ? localize('Wait for payment') : localize('Pay now');
        } else {
            status_string = is_buy_order ? localize('Pay now') : localize('Wait for payment');
        }
    } else if (is_buyer_cancelled_order) {
        status_string = localize('Cancelled');
    } else if (is_buyer_confirmed_order) {
        if (is_my_ad) {
            status_string = is_buy_order ? localize('Confirm payment') : localize('Wait for release');
        } else {
            status_string = is_buy_order ? localize('Wait for release') : localize('Confirm payment');
        }
    } else if (is_expired_order || is_refunded_order) {
        status_string = localize('Expired');
    } else if (is_completed_order) {
        status_string = localize('Completed');
    } else {
        status_string = localize('Unknown');
    }

    return {
        ...order_details,
        is_active_order,
        is_buy_order,
        is_buyer_cancelled_order,
        is_buyer_confirmed_order,
        is_completed_order,
        is_expired_order,
        is_inactive_order,
        is_my_ad,
        is_pending_order,
        is_refunded_order,
        is_sell_order,
        labels: getOrderLabels(is_my_ad, is_buy_order, order_details),
        my_user_details: is_my_ad ? advertiser_details : client_details,
        order_expiry_milliseconds: convertToMillis(order_details.expiry_time),
        order_purchase_datetime: getFormattedDateString(new Date(convertToMillis(order_details.created_time))),
        other_user_details: is_my_ad ? client_details : advertiser_details,
        payment_method_display: getPaymentMethodsMap()?.[advert_details.payment_method] || localize('Unknown'),
        purchase_time: getFormattedDateString(new Date(convertToMillis(order_details.created_time))),
        should_highlight_alert,
        should_highlight_danger,
        should_highlight_disabled,
        should_show_cancel_and_paid_button,
        should_show_complain_and_received_button,
        should_show_order_footer,
        should_show_only_complain_button,
        status_string,
    };
};
