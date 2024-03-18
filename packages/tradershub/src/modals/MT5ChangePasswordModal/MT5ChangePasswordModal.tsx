import React from 'react';
import MT5ChangePassword from '@/features/cfd/modals/MT5PasswordModal/MT5ChangePassword';
import { useQueryParams } from '@/hooks';
import { Modal } from '@deriv-com/ui';

const MT5ChangePasswordModal = () => {
    const { isModalOpen, closeModal } = useQueryParams();
    return (
        <Modal ariaHideApp={false} isOpen={isModalOpen('MT5ChangePasswordModal')} onRequestClose={closeModal}>
            <MT5ChangePassword />
        </Modal>
    );
};

export default MT5ChangePasswordModal;
