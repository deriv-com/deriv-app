import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useCreateOtherCFDAccount, useDxtradeAccountsList } from '@deriv/api';
import { ModalStepWrapper, ModalWrapper, WalletButton } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import DxTradePasswordIcon from '../../../../public/images/ic-dxtrade-password.svg';
import { CFDSuccess, CreatePassword } from '../../screens';
import './DxtradeEnterPasswordModal.scss';

const DxtradeEnterPasswordModal = () => {
    const history = useHistory();
    const { isMobile } = useDevice();
    const [password, setPassword] = useState('');
    const { isLoading, isSuccess, mutate } = useCreateOtherCFDAccount();
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

    const renderFooter = () => {
        if (isSuccess) return <WalletButton isFullWidth onClick={() => hide()} size='lg' text='Continue' />;

        return (
            <WalletButton
                disabled={!password || isLoading}
                isFullWidth
                isLoading={isLoading}
                onClick={onSubmit}
                size='lg'
                text='Create Deriv MT5 password'
            />
        );
    };

    if (isMobile) {
        return (
            <ModalStepWrapper renderFooter={renderFooter} title={' '}>
                {isSuccess && dxtradeAccountListSuccess && (
                    <CFDSuccess
                        description={successDescription}
                        displayBalance={dxtradeBalance || ''}
                        marketType='all'
                        platform='dxtrade'
                        title={`Your Deriv X${accountType === 'demo' ? ` ${accountType}` : ''} account is ready`}
                    />
                )}
                {!isSuccess && (
                    <CreatePassword
                        icon={<DxTradePasswordIcon />}
                        isLoading={isLoading}
                        onPasswordChange={e => setPassword(e.target.value)}
                        onPrimaryClick={onSubmit}
                        password={password}
                        platform='dxtrade'
                    />
                )}
            </ModalStepWrapper>
        );
    }

    return (
        <ModalWrapper hideCloseButton={isSuccess}>
            {isSuccess && dxtradeAccountListSuccess && (
                <CFDSuccess
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
                    isLoading={isLoading}
                    onPasswordChange={e => setPassword(e.target.value)}
                    onPrimaryClick={onSubmit}
                    password={password}
                    platform='dxtrade'
                />
            )}
        </ModalWrapper>
    );
};

export default DxtradeEnterPasswordModal;
