import React from 'react';
import MT5ChangePassword from '@/features/cfd/modals/MT5PasswordModal/MT5ChangePassword';
import { useQueryParams } from '@/hooks';
import { Modal, Text } from '@deriv-com/ui';

const MT5ChangePasswordModal = () => {
    const { isModalOpen, closeModal } = useQueryParams();
    return (
        <Modal ariaHideApp={false} isOpen={isModalOpen('MT5ChangePasswordModal')} onRequestClose={closeModal}>
            <Modal.Header onRequestClose={closeModal}>
                <Text weight='bold'>Deriv MT5 latest password requirements</Text>
            </Modal.Header>
            <MT5ChangePassword />
        </Modal>
    );
};

export default MT5ChangePasswordModal;
