import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useCreateOtherCFDAccount, useDxtradeAccountsList } from '@deriv/api';
import { ModalWrapper, WalletButton } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import DxTradePasswordIcon from '../../../../public/images/ic-dxtrade-password.svg';
import { CreatePassword, Success } from '../../screens';
import './DxtradeEnterPasswordModal.scss';

const DxtradeEnterPasswordModal = () => {
    const history = useHistory();
    const [password, setPassword] = useState('');
    const { isSuccess, mutate } = useCreateOtherCFDAccount();
    const { data: dxtradeAccount, isSuccess: dxtradeAccountListSuccess } = useDxtradeAccountsList();
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

    const successDescription =
        accountType === 'demo'
            ? 'Transfer virtual funds from your Demo Wallet to your Deriv X Demo account to practise trading.'
            : `Transfer funds from your ${activeWallet?.currency} Wallet to your Deriv X account to start trading.`;

    const dxtradeBalance = dxtradeAccount?.find(account => account.market_type === 'all')?.display_balance;

    return (
        <ModalWrapper hideCloseButton={isSuccess}>
            {isSuccess && dxtradeAccountListSuccess && (
                <Success
                    description={successDescription}
                    displayBalance={dxtradeBalance || ''}
                    marketType='all'
                    platform='dxtrade'
                    renderButton={() => (
                        <div className='wallets-dxtrade-enter-password__button'>
                            <WalletButton onClick={hide} size='lg' text='Maybe later' variant='outlined' />
                            <WalletButton
                                onClick={() => {
                                    hide();
                                    history.push('/wallets/cashier/transfer');
                                }}
                                size='lg'
                                text='Transfer funds'
                            />
                        </div>
                    )}
                    title={`Your Deriv X${accountType === 'demo' ? ` ${accountType}` : ''} account is ready`}
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
