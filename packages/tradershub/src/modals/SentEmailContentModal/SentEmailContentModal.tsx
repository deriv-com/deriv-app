import React from 'react';
import { SentEmailContent } from '@/components';
import { useQueryParams } from '@/hooks';
import { Modal } from '@deriv-com/ui';

const SentEmailContentModal = () => {
    const { isModalOpen, closeModal } = useQueryParams();
    return (
        <Modal isOpen={isModalOpen('SentEmailContentModal')} onRequestClose={closeModal}>
            <Modal.Header title="We've sent you an email" />
            <Modal.Body>
                <SentEmailContent />
            </Modal.Body>
        </Modal>
    );
};

export default SentEmailContentModal;
