import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { useP2PAdvertiserPaymentMethods } from '@deriv/hooks';
import { Localize, localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

type TDeletePaymentMethodConfirmationModalProps = {
    payment_method_id: number;
    payment_method_name: string;
};

const DeletePaymentMethodConfirmationModal = ({
    payment_method_id,
    payment_method_name,
}: TDeletePaymentMethodConfirmationModalProps) => {
    const { hideModal, showModal } = useModalManagerContext();

    const handleDeleteError = (error: unknown) => {
        showModal({
            key: 'DeletePaymentMethodErrorModal',
            props: {
                error_message: error.message,
            },
        });
    };

    const { delete_payment_method } = useP2PAdvertiserPaymentMethods(handleDeleteError);

    const handleDelete = async () => {
        await delete_payment_method(payment_method_id);
        hideModal();
    };

    return (
        <Modal
            is_open
            small
            has_close_icon={false}
            title={
                <Text color='prominent' weight='bold'>
                    <Localize
                        i18n_default_text='Delete {{payment_method_name}}?'
                        values={{
                            payment_method_name,
                        }}
                    />
                </Text>
            }
        >
            <Modal.Body className='delete-payment-method-confirmation-modal'>
                <Text as='p' size='xs' color='prominent'>
                    <Localize i18n_default_text='Are you sure you want to remove this payment method?' />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button has_effect text={localize('Yes, remove')} onClick={handleDelete} secondary large />
                <Button has_effect text={localize('No')} onClick={hideModal} primary large />
            </Modal.Footer>
        </Modal>
    );
};

export default DeletePaymentMethodConfirmationModal;
