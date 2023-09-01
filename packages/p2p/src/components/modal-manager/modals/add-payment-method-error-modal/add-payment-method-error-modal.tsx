import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';

const AddPaymentMethodErrorModal = () => {
    const { my_profile_store } = useStores();
    const { is_modal_open, hideModal } = useModalManagerContext();
    const { add_payment_method_error_message, setAddPaymentMethodErrorMessage } = my_profile_store;
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
