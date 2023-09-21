import React, { useEffect } from 'react';
import { useCreateOtherCFDAccount } from '@deriv/api';
import { EnterPassword } from '../EnterPassword';
import { useModal } from '../ModalProvider';
import { WalletModal } from '../WalletModal';
import './DxtradeEnterPasswordModal.scss';

const DxtradeEnterPasswordModal = () => {
    const [password, setPassword] = React.useState('');
    const { isLoading, isSuccess, mutate } = useCreateOtherCFDAccount();
    const { hide } = useModal();

    const onSubmit = () =>
        mutate({
            payload: {
                account_type: 'demo',
                market_type: 'all',
                password,
                platform: 'dxtrade',
            },
        });

    useEffect(() => {
        if (isSuccess) hide();
    }, [hide, isSuccess]);

    return (
        <WalletModal className='wallets-dxtrade-enter-password' has_close_icon onClickCloseIcon={hide}>
            <EnterPassword
                isLoading={isLoading}
                marketType='all'
                onPasswordChange={e => setPassword(e.target.value)}
                onPrimaryClick={onSubmit}
                // onSecondaryClick={}
                platform='Deriv X'
            />
        </WalletModal>
    );
};

export default DxtradeEnterPasswordModal;
