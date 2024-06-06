import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

type TErrorModalProps = {
    error_message: React.ReactNode;
    error_modal_button_text?: string;
    error_modal_title?: string;
    has_close_icon?: boolean;
    onClose?: () => void;
};

const ErrorModal = ({
    error_message,
    error_modal_button_text = 'OK',
    error_modal_title,
    has_close_icon,
    onClose,
}: TErrorModalProps) => {
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { isDesktop } = useDevice();

    return (
        <Modal
            className='error-modal'
            has_close_icon={has_close_icon}
            is_open={is_modal_open}
            title={error_modal_title}
            toggleModal={onClose ?? hideModal}
            width={isDesktop ? '40rem' : '90rem'}
        >
            <Modal.Body className='error-modal__body'>
                <Text size='xs'>{error_message}</Text>
            </Modal.Body>
            <Modal.Footer>
                <Button large primary onClick={onClose ?? hideModal}>
                    <Localize i18n_default_text={error_modal_button_text} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default observer(ErrorModal);
