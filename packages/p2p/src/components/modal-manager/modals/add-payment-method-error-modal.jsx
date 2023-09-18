import React from 'react';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { Button, Modal, Text } from '@deriv/components';
import { useStores } from 'Stores';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';

const AddPaymentMethodErrorModal = () => {
    const { general_store, my_profile_store } = useStores();
    const { is_modal_open, hideModal } = useModalManagerContext();
    return (
        <Modal is_open={is_modal_open} small has_close_icon={false} title={localize("Something's not right")}>
            <Modal.Body>
                <Text color='prominent' size='xs'>
                    {my_profile_store.add_payment_method_error_message}
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    has_effect
                    text={localize('Ok')}
                    onClick={() => {
                        my_profile_store.setAddPaymentMethodErrorMessage('');
                        my_profile_store.setSelectedPaymentMethod('');
                        general_store.setSavedFormState(null);
                        general_store.setFormikRef(null);
                        hideModal({
                            should_save_form_history: true,
                        });
                    }}
                    primary
                    large
                />
            </Modal.Footer>
        </Modal>
    );
};

export default observer(AddPaymentMethodErrorModal);
