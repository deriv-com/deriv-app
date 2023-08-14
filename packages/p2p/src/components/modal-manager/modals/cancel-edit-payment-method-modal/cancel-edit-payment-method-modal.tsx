import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';

const CancelEditPaymentMethodModal = () => {
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { my_profile_store } = useStores();
    const { setPaymentMethodToEdit, setShouldShowEditPaymentMethodForm } = my_profile_store;

    return (
        <Modal
            has_close_icon={false}
            is_open={is_modal_open}
            small
            title={
                <Text color='prominent' weight='bold'>
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
                        setPaymentMethodToEdit(null);
                        setShouldShowEditPaymentMethodForm(false);
                        hideModal();
                    }}
                    secondary
                >
                    <Localize i18n_default_text='Cancel' />
                </Button>
                <Button large onClick={() => hideModal()} primary>
                    <Localize i18n_default_text="Don't cancel" />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default observer(CancelEditPaymentMethodModal);
