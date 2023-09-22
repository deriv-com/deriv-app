import React, { useEffect } from 'react';
import { useActiveWalletAccount, useCreateOtherCFDAccount } from '@deriv/api';
import DxTradePasswordIcon from '../../public/images/ic-dxtrade-password.svg';
import { CreatePassword } from '../CreatePassword';
import { useModal } from '../ModalProvider';
import { WalletModal } from '../WalletModal';
import './DxtradeEnterPasswordModal.scss';

const DxtradeEnterPasswordModal = () => {
    const [password, setPassword] = React.useState('');
    const { isSuccess, send } = useCreateOtherCFDAccount();
    const { data: activeWallet } = useActiveWalletAccount();
    const { hide } = useModal();

    const onSubmit = () =>
        send({
            account_type: activeWallet?.account_type || 'demo',
            market_type: 'all',
            password,
            platform: 'dxtrade',
        });

    useEffect(() => {
        if (isSuccess) hide();
    }, [hide, isSuccess]);

    return (
        <WalletModal has_close_icon onClickCloseIcon={hide}>
            <CreatePassword
                icon={<DxTradePasswordIcon />}
                onPasswordChange={e => setPassword(e.target.value)}
                onPrimaryClick={onSubmit}
                platform='Deriv X'
            />
        </WalletModal>
    );
};

export default DxtradeEnterPasswordModal;
