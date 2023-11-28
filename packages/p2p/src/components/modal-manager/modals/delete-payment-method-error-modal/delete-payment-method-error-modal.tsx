import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

type TDeletePaymentMethodErrorModalProps = {
    error_message: string;
};

const DeletePaymentMethodErrorModal = ({ error_message }: TDeletePaymentMethodErrorModalProps) => {
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <Modal
            is_open={is_modal_open}
            small
            has_close_icon={false}
            title={localize('That payment method cannot be deleted')}
        >
            <Modal.Body>
                <Text as='p' size='xs' color='prominent'>
                    {error_message}
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    has_effect
                    text={localize('Ok')}
                    onClick={() => hideModal({ should_hide_all_modals: true })}
                    primary
                    large
                />
            </Modal.Footer>
        </Modal>
    );
};

export default observer(DeletePaymentMethodErrorModal);
