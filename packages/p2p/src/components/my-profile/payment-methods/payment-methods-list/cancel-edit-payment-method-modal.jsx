import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { Localize } from 'Components/i18next';

const CancelEditPaymentMethodModal = () => {
    const { my_profile_store } = useStores();

    return (
        <Modal
            has_close_icon={false}
            is_open={my_profile_store.is_cancel_edit_payment_method_modal_open}
            small
            title={
                <Text color='prominent' size='s' weight='bold'>
                    <Localize i18n_default_text='Cancel your edits?' />
                </Text>
            }
        >
            <Modal.Body>
                <Text color='prominent' size='xs'>
                    <Localize i18n_default_text='If you choose to cancel, the edited details will be lost.' />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    large
                    onClick={() => {
                        my_profile_store.setIsCancelEditPaymentMethodModalOpen(false);
                        my_profile_store.setPaymentMethodToEdit(null);
                        my_profile_store.setShouldShowEditPaymentMethodForm(false);
                    }}
                    secondary
                >
                    <Localize i18n_default_text='Cancel' />
                </Button>
                <Button
                    large
                    onClick={() => {
                        my_profile_store.setIsCancelEditPaymentMethodModalOpen(false);
                    }}
                    primary
                >
                    <Localize i18n_default_text="Don't cancel" />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default observer(CancelEditPaymentMethodModal);
