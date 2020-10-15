import React from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Modal } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import { requestWS } from 'Utils/websocket';
import { localize, Localize } from 'Components/i18next';
import FormError from '../../form/error.jsx';

const OrderDetailsFooter = ({ order_information }) => {
    const isMounted = useIsMounted();
    const {
        account_currency,
        amount_display,
        id,
        is_buy_order,
        is_my_ad,
        is_sell_order,
        local_currency,
        other_user_details,
        price_display,
        should_show_cancel_and_paid_button,
        should_show_complain_and_received_button,
        should_show_only_complain_button,
    } = order_information;

    const is_buy_order_for_user = (is_buy_order && !is_my_ad) || (is_sell_order && is_my_ad);

    const [should_show_cancel_modal, setShouldShowCancelModal] = React.useState(false);
    const [should_show_complain_modal, setShouldShowComplainModal] = React.useState(false);
    const [should_show_confirm_modal, setShouldShowConfirmModal] = React.useState(false);

    const hideCancelOrderModal = () => setShouldShowCancelModal(false);
    const showCancelOrderModal = () => setShouldShowCancelModal(true);

    const hideComplainOrderModal = () => setShouldShowComplainModal(false);
    const showComplainOrderModal = () => setShouldShowComplainModal(true);

    const hideConfirmOrderModal = () => setShouldShowConfirmModal(false);
    const showConfirmOrderModal = () => setShouldShowConfirmModal(true);

    const CancelOrderModal = () => {
        const [error_message, setErrorMessage] = React.useState('');

        const cancelOrderRequest = () => {
            return new Promise(resolve => {
                requestWS({
                    p2p_order_cancel: 1,
                    id,
                }).then(response => {
                    if (isMounted()) {
                        if (response.error) {
                            setErrorMessage(response.error.message);
                        }
                    }
                    resolve();
                });
            });
        };

        return (
            <Modal
                className='cancel-modal'
                is_open={should_show_cancel_modal}
                toggleModal={hideCancelOrderModal}
                title={localize('Do you want to cancel this order?')}
                has_close_icon
            >
                <Modal.Body>{localize('Do NOT cancel if you have made payment.')}</Modal.Body>
                <Modal.Footer>
                    {error_message && <FormError message={error_message} />}
                    <Button.Group>
                        <Button secondary type='button' onClick={hideCancelOrderModal} large>
                            {localize('Do not cancel')}
                        </Button>
                        <Button primary large onClick={cancelOrderRequest}>
                            {localize('Cancel this order')}
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal>
        );
    };

    const ComplainOrderModal = () => {
        const [dispute_reason, setDisputeReason] = React.useState('');
        const [error_message, setErrorMessage] = React.useState('');

        const disputeOrderRequest = () => {
            return new Promise(resolve => {
                requestWS({
                    p2p_order_dispute: 1,
                    id,
                    dispute_reason,
                }).then(response => {
                    if (isMounted()) {
                        if (response.error) {
                            setErrorMessage(response.error.message);
                        }
                        hideComplainOrderModal();
                    }
                    resolve();
                });
            });
        };

        const onChange = reason => {
            setDisputeReason(reason);
        };

        return (
            <Modal
                className='complain-modal'
                is_open={should_show_complain_modal}
                toggleModal={hideComplainOrderModal}
                title={localize('What’s your complaint?')}
                has_close_icon
            >
                <Modal.Body>
                    <Checkbox
                        name={is_buy_order_for_user ? 'seller_not_released' : 'buyer_not_paid'}
                        onChange={event => {
                            onChange(event.target.name);
                        }}
                        value={dispute_reason === 'seller_not_released' || dispute_reason === 'buyer_not_paid'}
                        label={
                            is_buy_order_for_user
                                ? localize('I’ve made full payment, but the seller hasn’t released the funds.')
                                : localize('I’ve not received any payment.')
                        }
                    />
                    <Checkbox
                        name='buyer_underpaid'
                        onChange={event => {
                            onChange(event.target.name);
                        }}
                        value={dispute_reason === 'buyer_underpaid'}
                        label={
                            is_buy_order_for_user
                                ? localize('I wasn’t able to make full payment.')
                                : localize('I’ve received less than the agreed amount.')
                        }
                    />
                    <Checkbox
                        name='buyer_overpaid'
                        onChange={event => {
                            onChange(event.target.name);
                        }}
                        value={dispute_reason === 'buyer_overpaid'}
                        label={
                            is_buy_order_for_user
                                ? localize('I’ve paid more than the agreed amount.')
                                : localize('I’ve received more than the agreed amount.')
                        }
                    />
                    <div className='order-details__contact-text'>
                        <Localize
                            i18n_default_text="If your complaint isn't listed here, please contact our <0>Customer Support</0> team."
                            components={[
                                <a
                                    key={0}
                                    className='link order-details__popup--danger'
                                    rel='noopener noreferrer'
                                    target='_blank'
                                    href={'mailto:p2p-support@deriv.com'}
                                />,
                            ]}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {error_message && <FormError message={error_message} />}
                    <Button.Group>
                        <Button secondary type='button' onClick={hideComplainOrderModal} large>
                            {localize('Cancel')}
                        </Button>
                        <Button is_disabled={!dispute_reason} primary large onClick={disputeOrderRequest}>
                            {localize('Submit')}
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal>
        );
    };

    const ConfirmOrderModal = () => {
        const [error_message, setErrorMessage] = React.useState('');
        const [is_checkbox_checked, setIsCheckboxChecked] = React.useState(false);

        const confirmOrderRequest = () => {
            return new Promise(resolve => {
                requestWS({
                    p2p_order_confirm: 1,
                    id,
                }).then(response => {
                    if (isMounted()) {
                        if (response.error) {
                            setErrorMessage(response.error.message);
                        }
                    }
                    resolve();
                });
            });
        };

        return (
            <Modal
                className='confirm-modal'
                is_open={should_show_confirm_modal}
                toggleModal={hideConfirmOrderModal}
                title={is_buy_order_for_user ? localize('Confirm payment?') : localize('Have you received payment?')}
                has_close_icon
            >
                <Modal.Body>
                    {is_buy_order_for_user
                        ? localize(
                              "Please make sure that you've paid {{amount}} {{currency}} to {{other_user_name}}.",
                              {
                                  amount: price_display,
                                  currency: local_currency,
                                  other_user_name: other_user_details.name,
                              }
                          )
                        : localize(
                              'Please confirm only after checking your bank or e-wallet account to make sure you have received payment.'
                          )}

                    <Checkbox
                        className='order-details__modal-checkbox'
                        onChange={() => setIsCheckboxChecked(!is_checkbox_checked)}
                        defaultChecked={is_checkbox_checked}
                        label={
                            is_buy_order_for_user
                                ? localize('I have paid {{amount}} {{currency}}.', {
                                      amount: price_display,
                                      currency: local_currency,
                                  })
                                : localize('I have received {{amount}} {{currency}}.', {
                                      amount: price_display,
                                      currency: local_currency,
                                  })
                        }
                    />
                </Modal.Body>
                <Modal.Footer>
                    {error_message && <FormError message={error_message} />}
                    <Button.Group>
                        <Button secondary type='button' onClick={hideConfirmOrderModal} large>
                            {is_buy_order_for_user ? localize("I haven't paid yet") : localize('Cancel')}
                        </Button>
                        <Button is_disabled={!is_checkbox_checked} primary large onClick={confirmOrderRequest}>
                            {is_buy_order_for_user
                                ? localize("I've paid")
                                : localize('Release {{amount}} {{currency}}', {
                                      amount: amount_display,
                                      currency: account_currency,
                                  })}
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal>
        );
    };

    if (should_show_complain_and_received_button) {
        return (
            <React.Fragment>
                <div className='order-details__footer'>
                    <div className='order-details__footer--left'>
                        <Button large tertiary onClick={showComplainOrderModal}>
                            {localize('Complain')}
                        </Button>
                    </div>
                    <div className='order-details__footer--right'>
                        <Button large primary onClick={showConfirmOrderModal}>
                            {localize("I've received funds")}
                        </Button>
                    </div>
                </div>
                <ComplainOrderModal />
                <ConfirmOrderModal />
            </React.Fragment>
        );
    }

    if (should_show_cancel_and_paid_button) {
        return (
            <React.Fragment>
                <div className='order-details__footer'>
                    <div className='order-details__footer--right'>
                        <Button.Group>
                            <Button large secondary onClick={showCancelOrderModal}>
                                {localize('Cancel order')}
                            </Button>
                            <Button large primary onClick={showConfirmOrderModal}>
                                {localize("I've paid")}
                            </Button>
                        </Button.Group>
                    </div>
                </div>
                <CancelOrderModal />
                <ConfirmOrderModal />
            </React.Fragment>
        );
    }

    if (should_show_only_complain_button) {
        return (
            <React.Fragment>
                <div className='order-details__footer'>
                    <div className='order-details__footer--left'>
                        <Button
                            className='order-details__footer-button--left'
                            large
                            tertiary
                            onClick={showComplainOrderModal}
                        >
                            {localize('Complain')}
                        </Button>
                    </div>
                </div>
                <ComplainOrderModal />
            </React.Fragment>
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
