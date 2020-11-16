import React from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Modal, RadioGroup } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import { requestWS } from 'Utils/websocket';
import { localize, Localize } from 'Components/i18next';
import FormError from '../form/error.jsx';
import './order-details.scss';

const CancelOrderModal = ({ id, hideCancelOrderModal, should_show_cancel_modal }) => {
    const isMounted = useIsMounted();
    const [error_message, setErrorMessage] = React.useState('');

    const cancelOrderRequest = () => {
        requestWS({
            p2p_order_cancel: 1,
            id,
        }).then(response => {
            if (isMounted()) {
                if (response.error) {
                    setErrorMessage(response.error.message);
                }
            }
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
            <Modal.Body>
                <Localize i18n_default_text='Do NOT cancel if you have made payment.' />
            </Modal.Body>
            <Modal.Footer>
                {error_message && <FormError message={error_message} />}
                <Button.Group>
                    <Button secondary type='button' onClick={hideCancelOrderModal} large>
                        <Localize i18n_default_text='Do not cancel' />
                    </Button>
                    <Button primary large onClick={cancelOrderRequest}>
                        <Localize i18n_default_text='Cancel this order' />
                    </Button>
                </Button.Group>
            </Modal.Footer>
        </Modal>
    );
};

const ComplainOrderModal = ({ id, is_buy_order_for_user, hideComplainOrderModal, should_show_complain_modal }) => {
    const isMounted = useIsMounted();
    const [dispute_reason, setDisputeReason] = React.useState('');
    const [error_message, setErrorMessage] = React.useState('');

    const disputeOrderRequest = () => {
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
                <RadioGroup
                    name='reason'
                    items={[
                        {
                            value: is_buy_order_for_user ? 'seller_not_released' : 'buyer_not_paid',
                            label: is_buy_order_for_user
                                ? localize('I’ve made full payment, but the seller hasn’t released the funds.')
                                : localize('I’ve not received any payment.'),
                        },
                        {
                            value: 'buyer_underpaid',
                            label: is_buy_order_for_user
                                ? localize('I wasn’t able to make full payment.')
                                : localize('I’ve received less than the agreed amount.'),
                        },
                        {
                            value: 'buyer_overpaid',
                            label: is_buy_order_for_user
                                ? localize('I’ve paid more than the agreed amount.')
                                : localize('I’ve received more than the agreed amount.'),
                        },
                    ]}
                    onToggle={event => {
                        onChange(event.target.value);
                    }}
                    selected={dispute_reason}
                    required
                />
                <div className='order-details__contact-text'>
                    <Localize i18n_default_text="If your complaint isn't listed here, please contact our Customer Support team." />
                </div>
            </Modal.Body>
            <Modal.Footer>
                {error_message && <FormError message={error_message} />}
                <Button.Group>
                    <Button secondary type='button' onClick={hideComplainOrderModal} large>
                        <Localize i18n_default_text='Cancel' />
                    </Button>
                    <Button is_disabled={!dispute_reason} primary large onClick={disputeOrderRequest}>
                        <Localize i18n_default_text='Submit' />
                    </Button>
                </Button.Group>
            </Modal.Footer>
        </Modal>
    );
};

const ConfirmOrderModal = ({
    order_information,
    is_buy_order_for_user,
    hideConfirmOrderModal,
    should_show_confirm_modal,
}) => {
    const {
        account_currency,
        amount_display,
        id,
        local_currency,
        other_user_details,
        price_display,
    } = order_information;

    const isMounted = useIsMounted();
    const [error_message, setErrorMessage] = React.useState('');
    const [is_checkbox_checked, setIsCheckboxChecked] = React.useState(false);

    const confirmOrderRequest = () => {
        requestWS({
            p2p_order_confirm: 1,
            id,
        }).then(response => {
            if (isMounted()) {
                if (response.error) {
                    setErrorMessage(response.error.message);
                }
            }
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
                {is_buy_order_for_user ? (
                    <Localize
                        i18n_default_text="Please make sure that you've paid {{amount}} {{currency}} to {{other_user_name}}."
                        values={{
                            amount: price_display,
                            currency: local_currency,
                            other_user_name: other_user_details.name,
                        }}
                    />
                ) : (
                    <Localize i18n_default_text='Please confirm only after checking your bank or e-wallet account to make sure you have received payment.' />
                )}

                <Checkbox
                    className='order-details__modal-checkbox'
                    onChange={() => setIsCheckboxChecked(!is_checkbox_checked)}
                    defaultChecked={is_checkbox_checked}
                    label={
                        is_buy_order_for_user ? (
                            <Localize
                                i18n_default_text='I have paid {{amount}} {{currency}}'
                                values={{
                                    amount: price_display,
                                    currency: local_currency,
                                }}
                            />
                        ) : (
                            <Localize
                                i18n_default_text='I have received {{amount}} {{currency}}'
                                values={{
                                    amount: price_display,
                                    currency: local_currency,
                                }}
                            />
                        )
                    }
                />
            </Modal.Body>
            <Modal.Footer>
                {error_message && <FormError message={error_message} />}
                <Button.Group>
                    <Button secondary type='button' onClick={hideConfirmOrderModal} large>
                        {is_buy_order_for_user ? (
                            <Localize i18n_default_text="I haven't paid yet" />
                        ) : (
                            <Localize i18n_default_text='Cancel' />
                        )}
                    </Button>
                    <Button is_disabled={!is_checkbox_checked} primary large onClick={confirmOrderRequest}>
                        {is_buy_order_for_user ? (
                            <Localize i18n_default_text="I've paid" />
                        ) : (
                            <Localize
                                i18n_default_text='Release {{amount}} {{currency}}'
                                values={{
                                    amount: amount_display,
                                    currency: account_currency,
                                }}
                            />
                        )}
                    </Button>
                </Button.Group>
            </Modal.Footer>
        </Modal>
    );
};

const OrderDetailsFooter = ({ order_information }) => {
    const {
        is_buy_order,
        is_my_ad,
        is_sell_order,
        should_show_cancel_and_paid_button,
        should_show_complain_and_received_button,
        should_show_only_received_button,
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

    if (should_show_cancel_and_paid_button) {
        return (
            <React.Fragment>
                <div className='order-details__footer'>
                    <div className='order-details__footer--right'>
                        <Button.Group>
                            <Button large secondary onClick={showCancelOrderModal}>
                                <Localize i18n_default_text='Cancel order' />
                            </Button>
                            <Button large primary onClick={showConfirmOrderModal}>
                                <Localize i18n_default_text="I've paid" />
                            </Button>
                        </Button.Group>
                    </div>
                </div>
                <CancelOrderModal
                    id={order_information.id}
                    hideCancelOrderModal={hideCancelOrderModal}
                    should_show_cancel_modal={should_show_cancel_modal}
                />
                <ConfirmOrderModal
                    order_information={order_information}
                    is_buy_order_for_user={is_buy_order_for_user}
                    hideConfirmOrderModal={hideConfirmOrderModal}
                    should_show_confirm_modal={should_show_confirm_modal}
                />
            </React.Fragment>
        );
    }

    if (should_show_complain_and_received_button) {
        return (
            <React.Fragment>
                <div className='order-details__footer'>
                    <div className='order-details__footer--left'>
                        <Button large tertiary onClick={showComplainOrderModal}>
                            <Localize i18n_default_text='Complain' />
                        </Button>
                    </div>
                    <div className='order-details__footer--right'>
                        <Button large primary onClick={showConfirmOrderModal}>
                            <Localize i18n_default_text="I've received payment" />
                        </Button>
                    </div>
                </div>
                <ComplainOrderModal
                    id={order_information.id}
                    is_buy_order_for_user={is_buy_order_for_user}
                    hideComplainOrderModal={hideComplainOrderModal}
                    should_show_complain_modal={should_show_complain_modal}
                />
                <ConfirmOrderModal
                    order_information={order_information}
                    is_buy_order_for_user={is_buy_order_for_user}
                    hideConfirmOrderModal={hideConfirmOrderModal}
                    should_show_confirm_modal={should_show_confirm_modal}
                />
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
                            <Localize i18n_default_text='Complain' />
                        </Button>
                    </div>
                </div>
                <ComplainOrderModal
                    id={order_information.id}
                    is_buy_order_for_user={is_buy_order_for_user}
                    hideComplainOrderModal={hideComplainOrderModal}
                    should_show_complain_modal={should_show_complain_modal}
                />
            </React.Fragment>
        );
    }

    if (should_show_only_received_button) {
        return (
            <React.Fragment>
                <div className='order-details__footer'>
                    <div className='order-details__footer--right'>
                        <Button large primary onClick={showConfirmOrderModal}>
                            <Localize i18n_default_text="I've received payment" />
                        </Button>
                    </div>
                </div>
                <ConfirmOrderModal
                    order_information={order_information}
                    is_buy_order_for_user={is_buy_order_for_user}
                    hideConfirmOrderModal={hideConfirmOrderModal}
                    should_show_confirm_modal={should_show_confirm_modal}
                />
            </React.Fragment>
        );
    }

    return null;
};

OrderDetailsFooter.propTypes = {
    order_information: PropTypes.object,
};

export default OrderDetailsFooter;
