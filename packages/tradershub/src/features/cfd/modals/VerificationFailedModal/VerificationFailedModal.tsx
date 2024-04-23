import React from 'react';
import { useQueryParams } from '@/hooks';
import { VerificationFailed } from '@cfd/screens';
import { Modal } from '@deriv-com/ui';

const VerificationFailedModal = () => {
    const { closeModal, isModalOpen } = useQueryParams();
    return (
        <Modal isOpen={isModalOpen('VerificationFailedModal')} onRequestClose={closeModal}>
            <Modal.Body>
                <VerificationFailed />
            </Modal.Body>
        </Modal>
    );
};

export default VerificationFailedModal;
