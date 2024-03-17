import React, { useState } from 'react';
import { useMT5AccountHandler, useQueryParams } from '@/hooks';
import { useCFDContext } from '@/providers';
import { MarketType } from '@cfd/constants';
import { CreatePassword, EnterPassword } from '@cfd/screens';
import { useAccountStatus, useActiveTradingAccount } from '@deriv/api-v2';
import { Modal } from '@deriv-com/ui';
import MT5ChangePassword from './MT5ChangePassword';
import MT5PasswordFooter from './MT5PasswordFooter';
import MT5SuccessModal from './MT5SuccessModal';

type TMT5PasswordInputProps = {
    password: string;
    setPassword: (password: string) => void;
};

const MT5PasswordInput = ({ password, setPassword }: TMT5PasswordInputProps) => {
    const { data: accountStatus } = useAccountStatus();
    const { cfdState } = useCFDContext();

    const { platform, marketType: marketTypeState } = cfdState;

    const marketType = marketTypeState ?? MarketType.ALL;

    const isMT5PasswordNotSet = accountStatus?.is_mt5_password_not_set;
    const { doesNotMeetPasswordPolicy, isCreateMT5AccountSuccess } = useMT5AccountHandler();
    const { data: activeTrading } = useActiveTradingAccount();

    const isDemo = activeTrading?.is_virtual;

    if (doesNotMeetPasswordPolicy) {
        return (
            <React.Fragment>
                <Modal.Header title='Deriv MT5 latest password requirements<' />
                <Modal.Body>
                    <MT5ChangePassword />
                </Modal.Body>
                <Modal.Footer>
                    <MT5PasswordFooter password={password} />
                </Modal.Footer>
            </React.Fragment>
        );
    }

    if (isCreateMT5AccountSuccess)
        return (
            <React.Fragment>
                <Modal.Body>
                    <MT5SuccessModal />
                </Modal.Body>
            </React.Fragment>
        );

    if (isMT5PasswordNotSet) {
        return (
            <CreatePassword
                isDemo={isDemo}
                onPasswordChange={e => setPassword(e.target.value)}
                password={password}
                platform={platform}
            />
        );
    }

    return (
        <EnterPassword
            marketType={marketType}
            onPasswordChange={e => setPassword(e.target.value)}
            password={password}
            platform={platform}
        />
    );
};

const MT5PasswordModal = () => {
    const [password, setPassword] = useState('');
    const { closeModal, isModalOpen } = useQueryParams();

    return (
        <Modal ariaHideApp={false} isOpen={isModalOpen('MT5PasswordModal')} onRequestClose={closeModal}>
            {MT5PasswordInput({ password, setPassword })}
        </Modal>
    );
};

export default MT5PasswordModal;
