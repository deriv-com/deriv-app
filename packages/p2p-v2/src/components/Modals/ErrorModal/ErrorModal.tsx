import React from 'react';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './ErrorModal.scss';

type TErrorModalProps = {
    isModalOpen: boolean;
    message?: string;
    onRequestClose: () => void;
};

const ErrorModal = ({ isModalOpen, message, onRequestClose }: TErrorModalProps) => {
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'lg' : 'md';
    return (
        <Modal
            ariaHideApp={false}
            className='p2p-v2-error-modal'
            isOpen={isModalOpen}
            shouldCloseOnOverlayClick={false}
        >
            <Modal.Header hideBorder>
                <Text size={textSize} weight='bold'>{`Something's not right`}</Text>
            </Modal.Header>
            <Modal.Body className='p2p-v2-error-modal__body'>
                <Text size={textSize}>{message ?? `Something's not right`}</Text>
            </Modal.Body>
            <Modal.Footer hideBorder>
                <Button onClick={onRequestClose} size='lg' textSize='sm'>
                    Ok
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ErrorModal;
