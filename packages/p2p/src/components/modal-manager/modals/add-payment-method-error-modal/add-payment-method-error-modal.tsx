import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';

const AddPaymentMethodErrorModal = () => {
    const { general_store, my_profile_store } = useStores();
    const { is_modal_open, hideModal } = useModalManagerContext();
    const { setFormikRef, setSavedFormState } = general_store;
    const { add_payment_method_error_message, setAddPaymentMethodErrorMessage, setSelectedPaymentMethod } =
        my_profile_store;
    return (
        <Modal is_open={is_modal_open} small has_close_icon={false} title={localize("Something's not right")}>
            <Modal.Body>
                <Text color='prominent' size='xs'>
                    {add_payment_method_error_message}
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    has_effect
                    text={localize('Ok')}
                    onClick={() => {
                        setAddPaymentMethodErrorMessage('');
                        setSavedFormState(null);
                        setFormikRef(null);
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
