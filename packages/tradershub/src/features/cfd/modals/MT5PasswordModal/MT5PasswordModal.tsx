import React, { useState } from 'react';
import { useQueryParams } from '@/hooks';
import { CreatePassword, EnterPassword } from '@cfd/screens';
import { useAccountStatus } from '@deriv/api-v2';
import { Modal } from '@deriv-com/ui';

const MT5PasswordModal = () => {
    const [password, setPassword] = useState('');
    const { closeModal, isModalOpen } = useQueryParams();
    const { data: accountStatus } = useAccountStatus();

    const isMT5PasswordNotSet = accountStatus?.is_mt5_password_not_set;

    const PasswordComponent = isMT5PasswordNotSet ? CreatePassword : EnterPassword;

    return (
        <Modal ariaHideApp={false} isOpen={isModalOpen('MT5PasswordModal')} onRequestClose={closeModal}>
            <PasswordComponent onPasswordChange={e => setPassword(e.target.value)} password={password} />
        </Modal>
    );
};

export default MT5PasswordModal;
