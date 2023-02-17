import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';

const DeletePaymentMethodErrorModal = () => {
    const { general_store, my_profile_store } = useStores();

    return (
        <Modal
            is_open={my_profile_store.is_delete_payment_method_error_modal_open}
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
                <Button
                    has_effect
                    text={localize('Ok')}
                    onClick={() => my_profile_store.setIsDeletePaymentMethodErrorModalOpen(false)}
                    primary
                    large
                />
            </Modal.Footer>
        </Modal>
    );
};

export default observer(DeletePaymentMethodErrorModal);
