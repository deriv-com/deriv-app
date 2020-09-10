import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@deriv/components';
import { localize, Localize } from 'Components/i18next';
import { requestWS } from 'Utils/websocket';
import FooterActions from 'Components/footer-actions/footer-actions.jsx';
import Dp2pContext from 'Components/context/dp2p-context';

const OrderActionsBlock = ({ cancelPopup, order_details, showPopup }) => {
    const { email_domain } = React.useContext(Dp2pContext);
    const {
        advertiser_name,
        display_offer_amount,
        display_transaction_amount,
        is_buyer,
        is_buyer_confirmed,
        is_pending,
        offer_currency,
        id,
        setStatus,
        transaction_currency,
        is_expired,
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
            title: localize('Do you want to cancel this order?'),
            className: 'order-details__popup-no-border',
            message: localize('Do NOT cancel if you have made payment.'),
            confirm_text: localize('Cancel this order'),
            has_cancel: true,
            cancel_text: localize('Do not cancel'),
            min_height: 130,
            onClickConfirm: cancel,
        };
        showPopup(options);
    };
    const showComplainPopup = () => {
        const options = {
            title: localize('Did something go wrong?'),
            className: 'order-details__popup-no-border',
            message: (
                <Localize
                    i18n_default_text="If you have a problem in using the app or if you have a dispute with the other party that the two of you haven't been able to resolve, please email <0>{{support_email}}</0>. Describe your situation, and include your order <1>ID ({{id}})</1>."
                    values={{ support_email: `p2p-support@${email_domain}`, id }}
                    components={[
                        <a
                            key={0}
                            className='link order-details__popup--danger'
                            rel='noopener noreferrer'
                            target='_blank'
                            href={`mailto:p2p-support@${email_domain}`}
                        />,
                        <span key={1} className='order-details__popup--bold' />,
                    ]}
                />
            ),
            confirm_text: localize('Close'),
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
            title: localize('Confirm payment?'),
            className: 'order-details__popup-no-border',
            message: localize("Please make sure that you've paid {{amount}} {{currency}} to {{advertiser_name}}.", {
                amount: display_transaction_amount,
                currency: transaction_currency,
                advertiser_name,
            }),
            payment_confirm: true,
            order: {
                transaction_currency,
                display_transaction_amount,
            },
            has_cancel: true,
            cancel_text: localize("I haven't paid yet"),
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
            title: localize('Have you received payment?'),
            className: 'order-details__popup-no-border',
            message: localize(
                'Please confirm only after checking your bank or e-wallet account to make sure you have received payment'
            ),
            need_confirmation: true,
            order: {
                display_offer_amount,
                offer_currency,
                transaction_currency,
                display_transaction_amount,
            },
            onClickConfirm: receive,
            has_cancel: true,
            cancel_text: localize('Cancel'),
        };
        showPopup(options);
    };

    if ((is_buyer_confirmed || is_expired) && !is_buyer) {
        buttons_to_render = (
            <React.Fragment>
                <div className='order-details__separator' />
                <FooterActions className='order-details__justify-space  order-details__footer'>
                    <Button className='order-details__complain-button' large tertiary onClick={showComplainPopup}>
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
                <FooterActions class='order-details__footer'>
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
                <FooterActions className='order-details__justify-start  order-details__footer'>
                    <Button large tertiary onClick={showComplainPopup}>
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
