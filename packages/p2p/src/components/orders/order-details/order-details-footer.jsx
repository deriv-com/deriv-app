import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@deriv/components';
import { localize, Localize } from 'Components/i18next';
import { requestWS } from 'Utils/websocket';
import Dp2pContext from 'Components/context/dp2p-context';

const OrderDetailsFooter = ({ order_information, cancelPopup, showPopup }) => {
    const { email_domain } = React.useContext(Dp2pContext);
    const {
        id,
        local_currency,
        other_user_details,
        price_display,
        should_show_complain_and_received_button,
        should_show_cancel_and_paid_button,
        should_show_only_complain_button,
    } = order_information;

    const showCancelOrderPopup = () => {
        const sendOrderCancelRequest = async setFormStatus => {
            setFormStatus({ error_message: '' });

            const cancel_response = await requestWS({ p2p_order_cancel: 1, id });

            if (!cancel_response.error) {
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
            onClickConfirm: sendOrderCancelRequest,
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
            onClickConfirm: () => cancelPopup(),
        };

        showPopup(options);
    };

    const showPaidOrderPopup = () => {
        const sendOrderConfirmRequest = async setFormStatus => {
            setFormStatus({ error_message: '' });

            const update_response = await requestWS({
                p2p_order_confirm: 1,
                id,
            });

            if (!update_response.error) {
                cancelPopup();
            } else {
                setFormStatus({ error_message: update_response.error.message });
            }
        };

        const options = {
            title: localize('Confirm payment?'),
            className: 'order-details__popup-no-border',
            message: localize("Please make sure that you've paid {{amount}} {{currency}} to {{other_user_name}}.", {
                amount: price_display,
                currency: local_currency,
                other_user_name: other_user_details.name,
            }),
            should_confirm_payment: true,
            order_information,
            has_cancel: true,
            cancel_text: localize("I haven't paid yet"),
            confirm_text: localize("I've paid"),
            onClickConfirm: sendOrderConfirmRequest,
        };

        showPopup(options);
    };

    const showReceivedFundsPopup = () => {
        const sendOrderConfirmRequest = async setFormStatus => {
            setFormStatus({ error_message: '' });

            const update_response = await requestWS({
                p2p_order_confirm: 1,
                id,
            });

            if (!update_response.error) {
                cancelPopup();
            } else {
                setFormStatus({ error_message: update_response.error.message });
            }
        };

        const options = {
            title: localize('Have you received payment?'),
            className: 'order-details__popup-no-border',
            message: localize(
                'Please confirm only after checking your bank or e-wallet account to make sure you have received payment.'
            ),
            need_confirmation: true,
            order_information,
            onClickConfirm: sendOrderConfirmRequest,
            has_cancel: true,
            cancel_text: localize('Cancel'),
        };

        showPopup(options);
    };

    if (should_show_complain_and_received_button) {
        return (
            <div className='order-details__footer'>
                <React.Fragment>
                    <div className='order-details__footer--left'>
                        <Button large tertiary onClick={showComplainPopup}>
                            {localize('Complain')}
                        </Button>
                    </div>
                    <div className='order-details__footer--right'>
                        <Button large primary onClick={showReceivedFundsPopup}>
                            {localize("I've received payment")}
                        </Button>
                    </div>
                </React.Fragment>
            </div>
        );
    }

    if (should_show_cancel_and_paid_button) {
        return (
            <div className='order-details__footer'>
                <div className='order-details__footer--right'>
                    <Button.Group>
                        <Button large secondary onClick={showCancelOrderPopup}>
                            {localize('Cancel order')}
                        </Button>
                        <Button large primary onClick={showPaidOrderPopup}>
                            {localize("I've paid")}
                        </Button>
                    </Button.Group>
                </div>
            </div>
        );
    }

    if (should_show_only_complain_button) {
        return (
            <div className='order-details__footer'>
                <div className='order-details__footer--left'>
                    <Button className='order-details__footer-button--left' large tertiary onClick={showComplainPopup}>
                        {localize('Complain')}
                    </Button>
                </div>
            </div>
        );
    }

    return null;
};

OrderDetailsFooter.propTypes = {
    cancelPopup: PropTypes.func,
    order_details: PropTypes.object,
    showPopup: PropTypes.func,
};

export default OrderDetailsFooter;
