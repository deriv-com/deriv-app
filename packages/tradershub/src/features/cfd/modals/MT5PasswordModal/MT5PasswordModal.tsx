import React, { useState } from 'react';
import { useQueryParams } from '@/hooks';
import { CreatePassword, EnterPassword } from '@cfd/screens';
import { useAccountStatus } from '@deriv/api-v2';
import { Modal } from '@deriv-com/ui';

type TMT5PasswordInputProps = {
    password: string;
    setPassword: (password: string) => void;
};

const RenderContent = ({ password, setPassword }: TMT5PasswordInputProps) => {
    const { data: accountStatus } = useAccountStatus();

    const isMT5PasswordNotSet = accountStatus?.is_mt5_password_not_set;

    if (isMT5PasswordNotSet) {
        return <CreatePassword onPasswordChange={e => setPassword(e.target.value)} password={password} />;
    }

    return <EnterPassword onPasswordChange={e => setPassword(e.target.value)} password={password} />;
};

const MT5PasswordModal = () => {
    const [password, setPassword] = useState('');
    const { closeModal, isModalOpen } = useQueryParams();

    return (
        <Modal ariaHideApp={false} isOpen={isModalOpen('MT5PasswordModal')} onRequestClose={closeModal}>
            {RenderContent({ password, setPassword })}
        </Modal>
    );
};

export default MT5PasswordModal;
