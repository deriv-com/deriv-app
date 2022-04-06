import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { Localize } from 'Components/i18next';

const CancelAddPaymentMethodModal = () => {
    const { buy_sell_store, my_profile_store } = useStores();

    const modalStateHandler = value => {
        my_profile_store.setModalOpenState(value);
    };

    return (
        <Modal
            has_close_icon={false}
            is_open={my_profile_store.is_cancel_add_payment_method_modal_open}
            small
            title={
                <Text color='prominent' size='s' weight='bold'>
                    <Localize i18n_default_text='Cancel adding this payment method?' />
                </Text>
            }
            getModalState={modalStateHandler}
        >
            <Modal.Body>
                <Text color='prominent' size='xs'>
                    <Localize i18n_default_text='If you choose to cancel, the details you’ve entered will be lost.' />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    large
                    onClick={() => {
                        my_profile_store.setIsCancelAddPaymentMethodModalOpen(false);
                        my_profile_store.setSelectedPaymentMethod('');
                        my_profile_store.setSelectedPaymentMethodDisplayName('');
                        const cancel_btn = setInterval(() => {
                            if (!my_profile_store.is_modal_open) {
                                buy_sell_store.setShouldShowPopup(true);
                                clearInterval(cancel_btn);
                            }
                        });

                        my_profile_store.setShouldShowAddPaymentMethodForm(true);
                    }}
                    secondary
                >
                    <Localize i18n_default_text='Cancel' />
                </Button>
                <Button
                    large
                    onClick={() => {
                        my_profile_store.setIsCancelAddPaymentMethodModalOpen(false);
                        my_profile_store.setSelectedPaymentMethod('');
                        const back_btn = setInterval(() => {
                            if (!my_profile_store.is_modal_open) {
                                buy_sell_store.setShouldShowPopup(true);
                                clearInterval(back_btn);
                            }
                        });
                    }}
                    primary
                >
                    <Localize i18n_default_text='Go back' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default observer(CancelAddPaymentMethodModal);
