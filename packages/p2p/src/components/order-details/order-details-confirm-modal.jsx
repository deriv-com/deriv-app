import PropTypes from 'prop-types';
import React from 'react';
import { Button, Checkbox, Modal, Text } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import { Localize } from 'Components/i18next';
import { requestWS } from 'Utils/websocket';
import FormError from 'Components/form/error.jsx';
import 'Components/order-details/order-details-confirm-modal.scss';

const OrderDetailsConfirmModal = ({
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
            className='order-details-confirm-modal'
            is_open={should_show_confirm_modal}
            toggleModal={hideConfirmOrderModal}
            has_close_icon
            renderTitle={() => (
                <Text color='prominent' line-height='m' size='s' weight='bold'>
                    {is_buy_order_for_user ? (
                        <Localize i18n_default_text='Confirm payment?' />
                    ) : (
                        <Localize i18n_default_text='Have you received payment?' />
                    )}
                </Text>
            )}
            width='440px'
        >
            <Modal.Body>
                <Text color='general' line-height='m' size='xs'>
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
                </Text>

                <Checkbox
                    className='order-details-card__modal-checkbox'
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

OrderDetailsConfirmModal.propTypes = {
    order_information: PropTypes.object,
    is_buy_order_for_user: PropTypes.bool,
    hideConfirmOrderModal: PropTypes.func,
    should_show_confirm_modal: PropTypes.bool,
};

export default OrderDetailsConfirmModal;
