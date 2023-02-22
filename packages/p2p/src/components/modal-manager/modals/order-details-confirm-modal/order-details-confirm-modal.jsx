import React from 'react';
import { Button, Checkbox, Modal, Text } from '@deriv/components';
import { useStores } from 'Stores';
import { Localize } from 'Components/i18next';
import FormError from 'Components/form/error.jsx';
import 'Components/order-details/order-details-confirm-modal.scss';
import { setDecimalPlaces, roundOffDecimal } from 'Utils/format-value';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const OrderDetailsConfirmModal = () => {
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { order_details_store, order_store } = useStores();
    const {
        account_currency,
        amount,
        amount_display,
        id,
        is_buy_order_for_user,
        local_currency,
        other_user_details,
        rate,
    } = order_store.order_information;
    const [is_checkbox_checked, setIsCheckboxChecked] = React.useState(false);
    const rounded_rate = roundOffDecimal(rate, setDecimalPlaces(rate, 6));

    return (
        <React.Fragment>
            <Modal
                className='order-details-confirm-modal'
                is_open={is_modal_open}
                toggleModal={hideModal}
                has_close_icon
                renderTitle={() => (
                    <Text color='prominent' line-height='m' size='s' weight='bold'>
                        {is_buy_order_for_user ? (
                            <Localize i18n_default_text='Payment confirmation' />
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
                                i18n_default_text='Have you paid {{amount}} {{currency}} to {{other_user_name}}?'
                                values={{
                                    amount: Number(roundOffDecimal(amount * rounded_rate)).toFixed(2),
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
                                <Localize i18n_default_text="Yes, I've paid" />
                            ) : (
                                <Localize
                                    i18n_default_text="I've received {{amount}} {{currency}}"
                                    values={{
                                        amount: Number(roundOffDecimal(amount * rounded_rate)).toFixed(2),
                                        currency: local_currency,
                                    }}
                                />
                            )
                        }
                    />
                </Modal.Body>
                <Modal.Footer>
                    {order_details_store.error_message && <FormError message={order_details_store.error_message} />}
                    <Button.Group>
                        <Button secondary type='button' onClick={hideModal} large>
                            {is_buy_order_for_user ? (
                                <Localize i18n_default_text="I haven't paid yet" />
                            ) : (
                                <Localize i18n_default_text='Cancel' />
                            )}
                        </Button>
                        <Button
                            is_disabled={!is_checkbox_checked}
                            primary
                            large
                            onClick={() => {
                                hideModal();
                                setIsCheckboxChecked(false);
                                order_store.confirmOrderRequest(id, is_buy_order_for_user);
                            }}
                        >
                            {is_buy_order_for_user ? (
                                <Localize i18n_default_text='Confirm' />
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
        </React.Fragment>
    );
};

export default OrderDetailsConfirmModal;
