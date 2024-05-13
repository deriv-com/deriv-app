import React from 'react';
import { SentEmailContent } from '@/components';
import { useQueryParams } from '@/hooks';
import { Modal, Text } from '@deriv-com/ui';

const SentEmailContentModal = () => {
    const { isModalOpen, closeModal } = useQueryParams();
    return (
        <Modal isOpen={isModalOpen('SentEmailContentModal')} onRequestClose={closeModal}>
            <Modal.Header onRequestClose={closeModal}>
                <Text weight='bold'>We&apos;ve sent you an email</Text>
            </Modal.Header>
            <Modal.Body>
                <SentEmailContent />
            </Modal.Body>
        </Modal>
    );
};

export default SentEmailContentModal;
