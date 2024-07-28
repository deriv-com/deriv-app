import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

type TAdCancelModalProps = {
    cancel_text?: string;
    confirm_label: string;
    message: string;
    onConfirm?: () => void;
    should_hide_all_modals?: boolean;
    should_restore_state?: boolean;
    title: string;
};

const AdCancelModal = ({
    cancel_text,
    confirm_label,
    message,
    onConfirm,
    should_hide_all_modals = true,
    should_restore_state = false,
    title,
}: TAdCancelModalProps) => {
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <Modal className='ad-cancel-modal' has_close_icon={false} is_open={is_modal_open} small title={title}>
            <Modal.Body>
                <Text as='p' size='xs' color='prominent'>
                    {message}
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    has_effect
                    text={cancel_text ?? localize('Cancel')}
                    onClick={() => {
                        hideModal({ should_hide_all_modals });
                        onConfirm?.();
                    }}
                    secondary
                    large
                />
                <Button
                    has_effect
                    text={confirm_label}
                    onClick={() => hideModal({ should_restore_local_state: should_restore_state })}
                    primary
                    large
                />
            </Modal.Footer>
        </Modal>
    );
};

export default AdCancelModal;
