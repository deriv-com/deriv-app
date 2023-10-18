import React, { useState } from 'react';
import { useActiveWalletAccount, useCreateOtherCFDAccount } from '@deriv/api';
import { ModalWrapper, WalletButton, WalletText } from '../../../../components/Base';
import DxTradePasswordIcon from '../../../../public/images/ic-dxtrade-password.svg';
import { Success, CreatePassword } from '../../screens';
import './DxtradeEnterPasswordModal.scss';
import { useModal } from '../../../../components/ModalProvider';

const DxtradeEnterPasswordModal = () => {
    const [password, setPassword] = useState('');
    const { isSuccess, mutate } = useCreateOtherCFDAccount();
    const { data: activeWallet } = useActiveWalletAccount();
    const { hide } = useModal();
    const accountType = activeWallet?.is_virtual ? 'demo' : 'real';

    const onSubmit = () => {
        mutate({
            payload: {
                account_type: accountType,
                market_type: 'all',
                password,
                platform: 'dxtrade',
            },
        });
    };

    return (
        <ModalWrapper hideCloseButton={isSuccess}>
            {isSuccess && (
                <Success
                    description={`You can now start practicing trading with your Deriv X ${accountType} account.`}
                    marketType='all'
                    platform='dxtrade'
                    renderButton={() => <WalletButton isFullWidth onClick={hide} size='lg' text='Continue' />}
                    title={`Your Deriv X ${accountType} account is ready`}
                />
            )}
            {!isSuccess && (
                <CreatePassword
                    icon={<DxTradePasswordIcon />}
                    onPasswordChange={e => setPassword(e.target.value)}
                    onPrimaryClick={onSubmit}
                    platform='dxtrade'
                />
            )}
        </ModalWrapper>
    );
};

export default DxtradeEnterPasswordModal;
