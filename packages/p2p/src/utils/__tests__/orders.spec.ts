import { P2POrderInfo } from '@deriv/api-types';
import { createExtendedOrderDetails } from '../orders';
import ServerTime from '../server-time';

const mock_order: P2POrderInfo = {
    account_currency: 'USD',
    advert_details: {
        block_trade: 0,
        description: 'Mock order description',
        id: 'AD123456',
        payment_method: 'Bank transfer',
        type: 'buy',
    },
    advertiser_details: {
        first_name: 'John',
        id: 'CR123',
        is_online: 1,
        is_recommended: 1,
        last_name: 'Doe',
        last_online_time: 1678945678,
        loginid: 'john123',
        name: 'John Doe',
        completed_orders_count: 10,
        rating_average: 4.5,
        rating_count: 20,
        recommended_average: 4.5,
        recommended_count: 20,
        total_completion_rate: 0.5,
    },
    amount: 0.5,
    amount_display: '0.5',
    chat_channel_url: 'https://deriv.com/',
    client_details: {
        first_name: 'Jane',
        id: 'CR121',
        is_online: 0,
        last_name: 'Smith',
        last_online_time: 1694679116,
        loginid: 'jane456',
        name: 'Jane Smith',
    },
    contact_info: 'Contact information will be provided after order confirmation.',
    created_time: 1694679116,
    dispute_details: {
        dispute_reason: null,
        disputer_loginid: null,
    },
    expiry_time: 1694851916,
    id: 'ORD123456',
    is_incoming: 0,
    is_reviewable: 1,
    is_seen: 0,
    local_currency: 'EUR',
    payment_info: 'Payment details will be provided after order confirmation.',
    price: 55000,
    price_display: '55000',
    rate: 110000,
    rate_display: '110000',
    review_details: {
        created_time: 1694765903,
        rating: 5,
        recommended: 1,
    },
    status: 'pending',
    type: 'buy',
};

const server_time: typeof ServerTime = {
    init: jest.fn(() => new Date().getTime()),
    get: jest.fn(() => new Date().getTime()),
    getDistanceToServerTime: jest.fn(),
};

const user_id = 'CR121';
const future_date = new Date();
future_date.setDate(new Date().getDate() + 2);

describe('createExtendedOrderDetails', () => {
    it('should handle getter for is_buy_order', () => {
        expect(createExtendedOrderDetails(mock_order, user_id, server_time).is_buy_order).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, type: 'sell' }, user_id, server_time).is_buy_order
        ).toBeFalsy();
    });
    it('should handle getter for is_sell_order', () => {
        expect(
            createExtendedOrderDetails({ ...mock_order, type: 'sell' }, user_id, server_time).is_sell_order
        ).toBeTruthy();
        expect(createExtendedOrderDetails({ ...mock_order }, user_id, server_time).is_sell_order).toBeFalsy();
    });
    it('should handle getter for is_buyer_cancelled_order', () => {
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'cancelled' }, user_id, server_time)
                .is_buyer_cancelled_order
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order }, user_id, server_time).is_buyer_cancelled_order
        ).toBeFalsy();
    });
    it('should handle getter for is_buyer_confirmed_order', () => {
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'buyer-confirmed' }, user_id, server_time)
                .is_buyer_confirmed_order
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order }, user_id, server_time).is_buyer_confirmed_order
        ).toBeFalsy();
    });
    it('should handle getter for is_completed_order', () => {
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'completed' }, user_id, server_time).is_completed_order
        ).toBeTruthy();
        expect(createExtendedOrderDetails({ ...mock_order }, user_id, server_time).is_completed_order).toBeFalsy();
    });
    it('should handle getter for is_disputed_order', () => {
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'disputed' }, user_id, server_time).is_disputed_order
        ).toBeTruthy();
        expect(createExtendedOrderDetails({ ...mock_order }, user_id, server_time).is_disputed_order).toBeFalsy();
    });
    it('should handle getter for is_dispute_refunded_order', () => {
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'dispute-refunded' }, user_id, server_time)
                .is_dispute_refunded_order
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order }, user_id, server_time).is_dispute_refunded_order
        ).toBeFalsy();
    });
    it('should handle getter for is_dispute_completed_order', () => {
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'dispute-completed' }, user_id, server_time)
                .is_dispute_completed_order
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order }, user_id, server_time).is_dispute_completed_order
        ).toBeFalsy();
    });
    it('should handle getter for is_expired_order', () => {
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'timed-out' }, user_id, server_time).is_expired_order
        ).toBeTruthy();
        expect(createExtendedOrderDetails({ ...mock_order }, user_id, server_time).is_expired_order).toBeFalsy();
    });
    it('should handle getter for is_incoming_order', () => {
        expect(
            createExtendedOrderDetails({ ...mock_order, is_incoming: 1 }, user_id, server_time).is_incoming_order
        ).toBeTruthy();
        expect(createExtendedOrderDetails({ ...mock_order }, user_id, server_time).is_incoming_order).toBeFalsy();
    });
    it('should handle getter for is_pending_order', () => {
        expect(createExtendedOrderDetails({ ...mock_order }, user_id, server_time).is_pending_order).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'completed' }, user_id, server_time).is_pending_order
        ).toBeFalsy();
    });
    it('should handle getter for is_refunded_order', () => {
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'refunded' }, user_id, server_time).is_refunded_order
        ).toBeTruthy();
        expect(createExtendedOrderDetails({ ...mock_order }, user_id, server_time).is_refunded_order).toBeFalsy();
    });
    it('should handle getter for is_my_ad', () => {
        expect(
            createExtendedOrderDetails(
                { ...mock_order, advertiser_details: { ...mock_order.advertiser_details, loginid: 'CR121' } },
                user_id,
                server_time
            ).is_my_ad
        ).toBeTruthy();
        expect(createExtendedOrderDetails({ ...mock_order }, user_id, server_time).is_my_ad).toBeFalsy();
    });
    it('should handle getter for is_inactive_order', () => {
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'refunded' }, user_id, server_time).is_inactive_order
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'cancelled' }, user_id, server_time).is_inactive_order
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'completed' }, user_id, server_time).is_inactive_order
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'dispute-completed' }, user_id, server_time)
                .is_inactive_order
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'dispute-refunded' }, user_id, server_time)
                .is_inactive_order
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'pending' }, user_id, server_time).is_inactive_order
        ).toBeFalsy();
    });
    it('should handle getter for is_active_order', () => {
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'pending' }, user_id, server_time).is_active_order
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'refunded' }, user_id, server_time).is_active_order
        ).toBeFalsy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'cancelled' }, user_id, server_time).is_active_order
        ).toBeFalsy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'completed' }, user_id, server_time).is_active_order
        ).toBeFalsy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'dispute-completed' }, user_id, server_time)
                .is_active_order
        ).toBeFalsy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'dispute-refunded' }, user_id, server_time)
                .is_active_order
        ).toBeFalsy();
    });
    it('should handle getter for is_finalised_order', () => {
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'pending' }, user_id, server_time).is_finalised_order
        ).toBeFalsy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'refunded' }, user_id, server_time).is_finalised_order
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'cancelled' }, user_id, server_time).is_finalised_order
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'completed' }, user_id, server_time).is_finalised_order
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'dispute-completed' }, user_id, server_time)
                .is_finalised_order
        ).toBeFalsy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'dispute-refunded' }, user_id, server_time)
                .is_finalised_order
        ).toBeFalsy();
    });
    it('should handle has_review_details method', () => {
        expect(createExtendedOrderDetails({ ...mock_order }, user_id, server_time).has_review_details).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, review_details: undefined }, user_id, server_time)
                .has_review_details
        ).toBeFalsy();
    });
    it('should handle getter for is_order_reviewable', () => {
        expect(createExtendedOrderDetails({ ...mock_order }, user_id, server_time).is_order_reviewable).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, is_reviewable: 0 }, user_id, server_time).is_order_reviewable
        ).toBeFalsy();
    });
    it('should handle getter for is_user_recommended_previously', () => {
        expect(
            createExtendedOrderDetails({ ...mock_order }, user_id, server_time).is_user_recommended_previously
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails(
                { ...mock_order, advertiser_details: { ...mock_order.advertiser_details, is_recommended: 0 } },
                user_id,
                server_time
            ).is_user_recommended_previously
        ).toBeFalsy();
    });
    it('should handle getter for rating', () => {
        expect(createExtendedOrderDetails({ ...mock_order }, user_id, server_time).rating).toEqual(5);
        expect(
            createExtendedOrderDetails({ ...mock_order, review_details: undefined }, user_id, server_time).rating
        ).toEqual(undefined);
    });
    it('should handle getter for is_ongoing_order', () => {
        expect(createExtendedOrderDetails({ ...mock_order }, user_id, server_time).is_ongoing_order).toBeFalsy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'completed' }, user_id, server_time).is_ongoing_order
        ).toBeFalsy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'buyer-confirmed' }, user_id, server_time)
                .is_ongoing_order
        ).toBeTruthy();
    });
    it('should handle getter for labels method', () => {
        expect(createExtendedOrderDetails({ ...mock_order }, user_id, server_time).labels).toEqual({
            counterparty_nickname_label: "Seller's nickname",
            counterparty_real_name_label: "Seller's real name",
            left_send_or_receive: 'Send',
            right_send_or_receive: 'Receive',
            payment_details: "Seller's payment details",
            contact_details: "Seller's contact details",
            instructions: "Seller's instructions",
            result_string: "You've received 0.5 USD",
        });
        expect(createExtendedOrderDetails({ ...mock_order, type: 'sell' }, user_id, server_time).labels).toEqual({
            counterparty_nickname_label: "Buyer's nickname",
            counterparty_real_name_label: "Buyer's real name",
            left_send_or_receive: 'Receive',
            right_send_or_receive: 'Send',
            payment_details: 'Your payment details',
            contact_details: 'Your contact details',
            instructions: "Buyer's instructions",
            result_string: 'You sold 0.5 USD',
        });
        expect(
            createExtendedOrderDetails(
                { ...mock_order, advertiser_details: { ...mock_order.advertiser_details, loginid: 'CR121' } },
                user_id,
                server_time
            ).labels
        ).toEqual({
            counterparty_nickname_label: "Buyer's nickname",
            counterparty_real_name_label: "Buyer's real name",
            left_send_or_receive: 'Receive',
            right_send_or_receive: 'Send',
            payment_details: 'Your payment details',
            contact_details: 'Your contact details',
            instructions: 'Your instructions',
            result_string: 'You sold 0.5 USD',
        });
        expect(
            createExtendedOrderDetails(
                {
                    ...mock_order,
                    advertiser_details: { ...mock_order.advertiser_details, loginid: 'CR121' },
                    type: 'sell',
                },
                user_id,
                server_time
            ).labels
        ).toEqual({
            counterparty_nickname_label: "Seller's nickname",
            counterparty_real_name_label: "Seller's real name",
            left_send_or_receive: 'Send',
            right_send_or_receive: 'Receive',
            payment_details: "Seller's payment details",
            contact_details: "Seller's contact details",
            instructions: 'Your instructions',
            result_string: "You've received 0.5 USD",
        });
    });
    it('should handle getter for other_user_details', () => {
        expect(createExtendedOrderDetails({ ...mock_order }, user_id, server_time).other_user_details).toEqual(
            mock_order.advertiser_details
        );
    });
    it('should handle getter for order_expiry_milliseconds', () => {
        expect(createExtendedOrderDetails({ ...mock_order }, user_id, server_time).order_expiry_milliseconds).toEqual(
            mock_order.expiry_time * 1000
        );
    });
    it('should handle getter for purchase_time', () => {
        const purchase_time = new Date(
            createExtendedOrderDetails({ ...mock_order }, user_id, server_time).purchase_time
        ).toUTCString();
        expect(purchase_time).toEqual('Thu, 14 Sep 2023 08:11:00 GMT');
    });
    it('should handler getter for is_buy_order_for_user', () => {
        expect(createExtendedOrderDetails({ ...mock_order }, user_id, server_time).is_buy_order_for_user).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, type: 'sell' }, user_id, server_time).is_buy_order_for_user
        ).toBeFalsy();
    });
    it('should handle getter for has_timer_expired method', () => {
        expect(createExtendedOrderDetails({ ...mock_order }, user_id, server_time).has_timer_expired).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, expiry_time: future_date.getTime() }, user_id, server_time)
                .has_timer_expired
        ).toBeFalsy();
    });
    it('should handle getter for remaining_seconds method', () => {
        expect(
            createExtendedOrderDetails(
                { ...mock_order, expiry_time: future_date.getTime() / 1000 },
                user_id,
                server_time
            ).remaining_seconds
        ).toEqual(172799);
    });
    it('should handle getter for should_highlight_disabled', () => {
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'completed' }, user_id, server_time)
                .should_highlight_disabled
        ).toBeFalsy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'refunded' }, user_id, server_time)
                .should_highlight_disabled
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'cancelled' }, user_id, server_time)
                .should_highlight_disabled
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'dispute-completed' }, user_id, server_time)
                .should_highlight_disabled
        ).toBeFalsy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'dispute-refunded' }, user_id, server_time)
                .should_highlight_disabled
        ).toBeTruthy();
    });
    it('should handle getter for should_highlight_alert', () => {
        expect(createExtendedOrderDetails({ ...mock_order }, user_id, server_time).should_highlight_alert).toBeFalsy();
        expect(
            createExtendedOrderDetails(
                { ...mock_order, expiry_time: future_date.getTime(), status: 'buyer-confirmed' },
                user_id,
                server_time
            ).should_highlight_alert
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails(
                { ...mock_order, expiry_time: future_date.getTime(), status: 'pending' },
                user_id,
                server_time
            ).should_highlight_alert
        ).toBeFalsy();
        expect(
            createExtendedOrderDetails(
                {
                    ...mock_order,
                    expiry_time: future_date.getTime(),
                    status: 'buyer-confirmed',
                    advertiser_details: { ...mock_order.advertiser_details, loginid: 'CR121' },
                },
                user_id,
                server_time
            ).should_highlight_alert
        ).toBeFalsy();
    });
    it('should handle getter for should_highlight_danger', () => {
        expect(createExtendedOrderDetails({ ...mock_order }, user_id, server_time).should_highlight_danger).toBeFalsy();
        expect(
            createExtendedOrderDetails(
                { ...mock_order, expiry_time: future_date.getTime(), status: 'buyer-confirmed' },
                user_id,
                server_time
            ).should_highlight_danger
        ).toBeFalsy();
        expect(
            createExtendedOrderDetails(
                { ...mock_order, expiry_time: future_date.getTime(), status: 'pending' },
                user_id,
                server_time
            ).should_highlight_danger
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails(
                {
                    ...mock_order,
                    expiry_time: future_date.getTime(),
                    status: 'buyer-confirmed',
                    advertiser_details: { ...mock_order.advertiser_details, loginid: 'CR121' },
                },
                user_id,
                server_time
            ).should_highlight_danger
        ).toBeTruthy();
    });
    it('should handle getter for should_highlight_success method', () => {
        expect(
            createExtendedOrderDetails({ ...mock_order }, user_id, server_time).should_highlight_success
        ).toBeFalsy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'completed' }, user_id, server_time)
                .should_highlight_success
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'dispute-completed' }, user_id, server_time)
                .should_highlight_success
        ).toBeTruthy();
    });
    it('should handle function for showing cancel and paid buttons', () => {
        expect(
            createExtendedOrderDetails({ ...mock_order }, user_id, server_time).should_show_cancel_and_paid_button
        ).toBeFalsy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'completed' }, user_id, server_time)
                .should_show_cancel_and_paid_button
        ).toBeFalsy();
        expect(
            createExtendedOrderDetails({ ...mock_order, expiry_time: future_date.getTime() }, user_id, server_time)
                .should_show_cancel_and_paid_button
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails(
                {
                    ...mock_order,
                    expiry_time: future_date.getTime(),
                    type: 'sell',
                    advertiser_details: { ...mock_order.advertiser_details, loginid: 'CR121' },
                },
                user_id,
                server_time
            ).should_show_cancel_and_paid_button
        ).toBeTruthy();
    });
    it('should handle function for showing complain and received button', () => {
        expect(
            createExtendedOrderDetails({ ...mock_order }, user_id, server_time).should_show_complain_and_received_button
        ).toBeFalsy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'completed' }, user_id, server_time)
                .should_show_complain_and_received_button
        ).toBeFalsy();
        expect(
            createExtendedOrderDetails(
                {
                    ...mock_order,
                    expiry_time: future_date.getTime(),
                    status: 'timed-out',
                    advertiser_details: { ...mock_order.advertiser_details, loginid: 'CR121' },
                },
                user_id,
                server_time
            ).should_show_complain_and_received_button
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails(
                { ...mock_order, expiry_time: future_date.getTime(), status: 'timed-out', type: 'sell' },
                user_id,
                server_time
            ).should_show_complain_and_received_button
        ).toBeTruthy();
    });
    it('should handle function for showing only complain button', () => {
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'completed' }, user_id, server_time)
                .should_show_only_complain_button
        ).toBeFalsy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'timed-out', type: 'sell' }, user_id, server_time)
                .should_show_only_complain_button
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'timed-out' }, user_id, server_time)
                .should_show_only_complain_button
        ).toBeTruthy();
    });
    it('should handle function for showing only received button', () => {
        expect(
            createExtendedOrderDetails(
                {
                    ...mock_order,
                    status: 'buyer-confirmed',
                    advertiser_details: { ...mock_order.advertiser_details, loginid: 'CR121' },
                },
                user_id,
                server_time
            ).should_show_only_received_button
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'disputed', type: 'sell' }, user_id, server_time)
                .should_show_only_received_button
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'buyer-confirmed', type: 'sell' }, user_id, server_time)
                .should_show_only_received_button
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'buyer-confirmed' }, user_id, server_time)
                .should_show_only_received_button
        ).toBeFalsy();
    });
    it('should handle function for showing order footer', () => {
        expect(
            createExtendedOrderDetails({ ...mock_order }, user_id, server_time).should_show_order_footer
        ).toBeFalsy();
        expect(
            createExtendedOrderDetails({ ...mock_order, expiry_time: future_date.getTime() }, user_id, server_time)
                .should_show_order_footer
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails(
                { ...mock_order, expiry_time: future_date.getTime(), status: 'timed-out', type: 'sell' },
                user_id,
                server_time
            ).should_show_order_footer
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'timed-out' }, user_id, server_time)
                .should_show_order_footer
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'disputed', type: 'sell' }, user_id, server_time)
                .should_show_order_footer
        ).toBeTruthy();
    });
    it('should handle function for showing order timer', () => {
        expect(
            createExtendedOrderDetails({ ...mock_order }, user_id, server_time).should_show_order_timer
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'completed' }, user_id, server_time)
                .should_show_order_timer
        ).toBeFalsy();
    });
    it('should handle function for showing lost funds banner', () => {
        expect(
            createExtendedOrderDetails({ ...mock_order }, user_id, server_time).should_show_lost_funds_banner
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'buyer-confirmed' }, user_id, server_time)
                .should_show_lost_funds_banner
        ).toBeTruthy();
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'completed' }, user_id, server_time)
                .should_show_lost_funds_banner
        ).toBeFalsy();
    });
    it('should handle getter function for status_string', () => {
        expect(createExtendedOrderDetails({ ...mock_order }, user_id, server_time).status_string).toEqual('Expired');
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'completed' }, user_id, server_time).status_string
        ).toEqual('Completed');
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'cancelled' }, user_id, server_time).status_string
        ).toEqual('Cancelled');
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'refunded' }, user_id, server_time).status_string
        ).toEqual('Expired');
        expect(
            createExtendedOrderDetails({ ...mock_order, status: 'disputed' }, user_id, server_time).status_string
        ).toEqual('Under dispute');
        expect(
            createExtendedOrderDetails(
                { ...mock_order, status: 'pending', expiry_time: future_date.getTime() },
                user_id,
                server_time
            ).status_string
        ).toEqual('Pay now');
        expect(
            createExtendedOrderDetails(
                { ...mock_order, status: 'pending', expiry_time: future_date.getTime(), type: 'sell' },
                user_id,
                server_time
            ).status_string
        ).toEqual('Wait for payment');
        expect(
            createExtendedOrderDetails(
                {
                    ...mock_order,
                    status: 'pending',
                    expiry_time: future_date.getTime(),
                    type: 'sell',
                    advertiser_details: { ...mock_order.advertiser_details, loginid: 'CR121' },
                },
                user_id,
                server_time
            ).status_string
        ).toEqual('Pay now');
        expect(
            createExtendedOrderDetails(
                {
                    ...mock_order,
                    status: 'pending',
                    expiry_time: future_date.getTime(),
                    advertiser_details: { ...mock_order.advertiser_details, loginid: 'CR121' },
                },
                user_id,
                server_time
            ).status_string
        ).toEqual('Wait for payment');
        expect(
            createExtendedOrderDetails(
                { ...mock_order, status: 'buyer-confirmed', type: 'sell', expiry_time: future_date.getTime() },
                user_id,
                server_time
            ).status_string
        ).toEqual('Confirm payment');
        expect(
            createExtendedOrderDetails(
                { ...mock_order, status: 'buyer-confirmed', expiry_time: future_date.getTime() },
                user_id,
                server_time
            ).status_string
        ).toEqual('Waiting for the seller to confirm');
        expect(
            createExtendedOrderDetails(
                {
                    ...mock_order,
                    status: 'buyer-confirmed',
                    expiry_time: future_date.getTime(),
                    advertiser_details: { ...mock_order.advertiser_details, loginid: 'CR121' },
                },
                user_id,
                server_time
            ).status_string
        ).toEqual('Confirm payment');
        expect(
            createExtendedOrderDetails(
                {
                    ...mock_order,
                    status: 'buyer-confirmed',
                    expiry_time: future_date.getTime(),
                    advertiser_details: { ...mock_order.advertiser_details, loginid: 'CR121' },
                    type: 'sell',
                },
                user_id,
                server_time
            ).status_string
        ).toEqual('Waiting for the seller to confirm');
    });
});
