import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const DeletePaymentMethodErrorModal = () => {
    const { general_store, my_profile_store } = useStores();
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <Modal
            is_open={is_modal_open}
            small
            has_close_icon={false}
            title={localize('That payment method cannot be deleted')}
            onMount={() => general_store.setIsModalOpen(true)}
            onUnmount={() => general_store.setIsModalOpen(false)}
        >
            <Modal.Body>
                <Text as='p' size='xs' color='prominent'>
                    {my_profile_store.delete_error_message}
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button has_effect text={localize('Ok')} onClick={hideModal} primary large />
            </Modal.Footer>
        </Modal>
    );
};

export default observer(DeletePaymentMethodErrorModal);
