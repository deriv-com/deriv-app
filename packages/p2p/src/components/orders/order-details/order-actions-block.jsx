import React        from 'react';
import PropTypes    from 'prop-types';
import { requestWS }       from 'Utils/websocket';
import { Button }   from 'deriv-components';
import { localize } from 'Components/i18next';
import AgentContext from 'Components/context/agent-context';

const OrderActionsBlock = ({ cancelPopup, order_details, showPopup }) => {
    const is_agent = React.useContext(AgentContext);
    const {
        display_offer_amount,
        display_transaction_amount,
        is_buyer,
        is_buyer_confirmed,
        is_pending,
        offer_currency,
        order_id,
        setStatus,
        transaction_currency,
    } = order_details;
    let buttons_to_render = null;

    const cancelOrder = () => {
        const cancel = async (setFormStatus) => {
            setFormStatus({ error_message: '' });
            const cancel_response = await requestWS({ p2p_order_cancel: 1, order_id });

            if (!cancel_response.error) {
                setStatus(cancel_response.p2p_order_cancel.status);
                cancelPopup();
            } else {
                setFormStatus({ error_message: cancel_response.error.message });
            }
        };
        const options = {
            title         : localize('Cancel this order?'),
            message       : localize('There will be no refund after cancelling the order. If you have paid, please do not cancel the order.'),
            confirm_text  : localize('Cancel this order'),
            onClickConfirm: cancel,
        };
        showPopup(options);
    };

    const paidOrder = () => {
        const payOrder = async (setFormStatus) => {
            setFormStatus({ error_message: '' });

            const update_response = await requestWS({
                p2p_order_confirm: 1,
                order_id,
            });
            if (!update_response.error) {
                setStatus(update_response.p2p_order_confirm.status);
                cancelPopup();
            } else {
                setFormStatus({ error_message: update_response.error.message });
            }
        };
        const options = {
            title         : localize('Confirm this payment?'),
            message       : localize('Make sure you have successfully sent the funds to the seller’s bank account or e-wallet mentioned above.'),
            has_cancel    : true,
            cancel_text   : localize('I didn\'t pay yet'),
            confirm_text  : localize('I\'ve paid'),
            onClickConfirm: payOrder,
        };
        showPopup(options);
    };

    const receivedFunds = () => {
        const receive = async (setFormStatus) => {
            setFormStatus({ error_message: '' });

            const update_response = await requestWS({
                p2p_order_confirm: 1,
                order_id,
            });
            if (!update_response.error) {
                setStatus(update_response.p2p_order_confirm.status);
                cancelPopup();
            } else {
                setFormStatus({ error_message: update_response.error.message });
            }
        };
        const options = {
            title            : localize('Have you received funds?'),
            message          : localize('Make sure that you have logged in your bank account or other e-wallet to check the receipt.'),
            need_confirmation: true,
            order            : {
                display_offer_amount,
                offer_currency,
                transaction_currency,
                display_transaction_amount,
            },
            onClickConfirm: receive,
        };
        showPopup(options);
    };

    if (is_agent && (is_pending || is_buyer_confirmed) && is_buyer) {
        buttons_to_render = (
            <Button className='order-details__actions-button' large primary onClick={receivedFunds}>{ localize('I\'ve received funds') }</Button>
        );
    }

    if (is_agent && is_pending && !is_buyer) {
        buttons_to_render = (
            <React.Fragment>
                <Button className='order-details__actions-button' large secondary onClick={cancelOrder}>{ localize('Cancel order') }</Button>
                <Button className='order-details__actions-button' large primary onClick={paidOrder}>{ localize('I\'ve paid') }</Button>
            </React.Fragment>
        );
    }

    if (!is_agent && is_pending && is_buyer) {
        buttons_to_render = (
            <React.Fragment>
                <Button className='order-details__actions-button' large secondary onClick={cancelOrder}>{ localize('Cancel order') }</Button>
                <Button className='order-details__actions-button' large primary onClick={paidOrder}>{ localize('I\'ve paid') }</Button>
            </React.Fragment>
        );
    }

    if (!is_agent && (is_pending || is_buyer_confirmed) && !is_buyer) {
        buttons_to_render = (
            <Button className='order-details__actions-button' large primary onClick={receivedFunds}>{ localize('I\'ve received funds') }</Button>
        );
    }

    return buttons_to_render;
};

OrderActionsBlock.propTypes = {
    cancelPopup  : PropTypes.func,
    order_details: PropTypes.object,
    showPopup    : PropTypes.func,
};

export default OrderActionsBlock;