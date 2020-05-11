import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@deriv/components';
import { localize, Localize } from 'Components/i18next';
import { requestWS } from 'Utils/websocket';
import FooterActions from 'Components/footer-actions/footer-actions.jsx';

const OrderActionsBlock = ({ cancelPopup, order_details, showPopup }) => {
    const {
        display_offer_amount,
        display_transaction_amount,
        is_buyer,
        is_buyer_confirmed,
        is_pending,
        is_expired,
        offer_currency,
        id,
        setStatus,
        transaction_currency,
    } = order_details;
    let buttons_to_render = null;

    const cancelOrder = () => {
        const cancel = async setFormStatus => {
            setFormStatus({ error_message: '' });
            const cancel_response = await requestWS({ p2p_order_cancel: 1, id });

            if (!cancel_response.error) {
                setStatus(cancel_response.p2p_order_cancel.status);
                cancelPopup();
            } else {
                setFormStatus({ error_message: cancel_response.error.message });
            }
        };
        const options = {
            title: localize('Cancel this order?'),
            message: localize('If you have paid, please do not cancel the order.'),
            confirm_text: localize('Cancel this order'),
            has_cancel: true,
            cancel_text: localize('Do not Cancel'),
            onClickConfirm: cancel,
        };
        showPopup(options);
    };
    const compalin = () => {
        const options = {
            title: localize('Something went wrong?'),
            message: (
                <Localize
                    i18n_default_text='If you can not resolve a dispute with the other party, please email
                <0>p2p-support@deriv.com</0>. Describe your situation and include your order 
                <1>ID ({{id}})</1>'
                    values={{ id }}
                    components={[
                        <span key={0} className='order-details__popup--danger' />,
                        <span key={1} className='order-details__popup--bold' />,
                    ]}
                />
            ),
            confirm_text: localize('Understood'),
            onClickConfirm: () => {
                cancelPopup();
            },
        };
        showPopup(options);
    };
    const paidOrder = () => {
        const payOrder = async setFormStatus => {
            setFormStatus({ error_message: '' });

            const update_response = await requestWS({
                p2p_order_confirm: 1,
                id,
            });
            if (!update_response.error) {
                setStatus(update_response.p2p_order_confirm.status);
                cancelPopup();
            } else {
                setFormStatus({ error_message: update_response.error.message });
            }
        };
        const options = {
            title: localize('Confirm this payment?'),
            message: localize(
                'Make sure you have successfully sent the funds to the seller’s bank account or e-wallet mentioned above.'
            ),
            has_cancel: true,
            payment_confirm: true,
            order: {
                transaction_currency,
                display_transaction_amount,
            },
            cancel_text: localize("I didn't pay yet"),
            confirm_text: localize("I've paid"),
            onClickConfirm: payOrder,
        };
        showPopup(options);
    };

    const receivedFunds = () => {
        const receive = async setFormStatus => {
            setFormStatus({ error_message: '' });

            const update_response = await requestWS({
                p2p_order_confirm: 1,
                id,
            });
            if (!update_response.error) {
                setStatus(update_response.p2p_order_confirm.status);
                cancelPopup();
            } else {
                setFormStatus({ error_message: update_response.error.message });
            }
        };
        const options = {
            title: localize('Have you received funds?'),
            message: localize(
                'Make sure that you have logged in your bank account or other e-wallet to check the receipt.'
            ),
            need_confirmation: true,
            order: {
                display_offer_amount,
                offer_currency,
                transaction_currency,
                display_transaction_amount,
            },
            onClickConfirm: receive,
        };
        showPopup(options);
    };

    if (is_buyer_confirmed && !is_buyer) {
        buttons_to_render = (
            <React.Fragment>
                <div className='order-details__separator' />
                <FooterActions className='order-details__justify-space'>
                    <Button className='order-details__complain-button' large tertiary onClick={compalin}>
                        {localize('Complain')}
                    </Button>
                    <Button
                        className='order-details__actions-button order-details__footer--right'
                        large
                        primary
                        onClick={receivedFunds}
                    >
                        {localize("I've received funds")}
                    </Button>
                </FooterActions>
            </React.Fragment>
        );
    }

    if (is_pending && is_buyer) {
        buttons_to_render = (
            <React.Fragment>
                <div className='order-details__separator' />
                <FooterActions>
                    <Button className='order-details__actions-button' large secondary onClick={cancelOrder}>
                        {localize('Cancel order')}
                    </Button>
                    <Button className='order-details__actions-button' large primary onClick={paidOrder}>
                        {localize("I've paid")}
                    </Button>
                </FooterActions>
            </React.Fragment>
        );
    }
    if (is_buyer && (is_expired || is_buyer_confirmed)) {
        buttons_to_render = (
            <React.Fragment>
                <div className='order-details__separator' />
                <FooterActions className='order-details__justify-start'>
                    <Button large tertiary onClick={compalin}>
                        {localize('Complain')}
                    </Button>
                </FooterActions>
            </React.Fragment>
        );
    }
    return buttons_to_render;
};

OrderActionsBlock.propTypes = {
    cancelPopup: PropTypes.func,
    order_details: PropTypes.object,
    showPopup: PropTypes.func,
};

export default OrderActionsBlock;
