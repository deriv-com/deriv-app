import React from 'react';
import MT5Success from '@/features/cfd/modals/MT5PasswordModal/MT5Success';
import { useQueryParams } from '@/hooks';
import { Modal } from '@deriv-com/ui';

const MT5SuccessModal = () => {
    const { isModalOpen, closeModal } = useQueryParams();
    return (
        <Modal ariaHideApp={false} isOpen={isModalOpen('MT5SuccessModal')} onRequestClose={closeModal}>
            <Modal.Body>
                <MT5Success />
            </Modal.Body>
        </Modal>
    );
};

export default MT5SuccessModal;
