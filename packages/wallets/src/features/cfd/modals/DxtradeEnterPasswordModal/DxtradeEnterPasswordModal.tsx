import React, { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAccountStatus, useActiveWalletAccount, useCreateOtherCFDAccount, useDxtradeAccountsList } from '@deriv/api';
import { SentEmailContent } from '../../../../components';
import { ModalStepWrapper, ModalWrapper, WalletButton, WalletButtonGroup } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import DxTradePasswordIcon from '../../../../public/images/ic-dxtrade-password.svg';
import { CFDSuccess, CreatePassword, EnterPassword } from '../../screens';
import './DxtradeEnterPasswordModal.scss';

const DxtradeEnterPasswordModal = () => {
    const history = useHistory();
    const { isMobile } = useDevice();
    const [password, setPassword] = useState('');
    const { data: getAccountStatus, isSuccess: accountStatusSuccess } = useAccountStatus();
    const { isLoading, isSuccess, mutate } = useCreateOtherCFDAccount();
    const { data: dxtradeAccount, isSuccess: dxtradeAccountListSuccess } = useDxtradeAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();
    const { hide, show } = useModal();
    const accountType = activeWallet?.is_virtual ? 'demo' : 'real';

    const isDxtradePasswordNotSet = getAccountStatus?.is_dxtrade_password_not_set;

    const onSubmit = useCallback(() => {
        mutate({
            payload: {
                account_type: accountType,
                market_type: 'all',
                password,
                platform: 'dxtrade',
            },
        });
    }, [mutate, accountType, password]);

    const successDescription = useMemo(() => {
        return accountType === 'demo'
            ? 'Transfer virtual funds from your Demo Wallet to your Deriv X Demo account to practise trading.'
            : `Transfer funds from your ${activeWallet?.currency} Wallet to your Deriv X account to start trading.`;
    }, [accountType, activeWallet?.currency]);

    const dxtradeBalance = useMemo(() => {
        return dxtradeAccount?.find(account => account.market_type === 'all')?.display_balance;
    }, [dxtradeAccount]);

    const renderFooter = useMemo(() => {
        if (isSuccess) {
            return (
                <WalletButtonGroup isFlex isFullWidth>
                    <WalletButton onClick={() => hide()} size='lg' text='Maybe later' variant='outlined' />
                    <WalletButton
                        onClick={() => {
                            hide();
                            history.push('/wallets/cashier/transfer');
                        }}
                        size='lg'
                        text='Transfer funds'
                    />
                </WalletButtonGroup>
            );
        }

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
    }, [hide, history, isLoading, isSuccess, onSubmit, password]);

    const successComponent = useMemo(() => {
        if (isSuccess && dxtradeAccountListSuccess) {
            return (
                <CFDSuccess
                    description={successDescription}
                    displayBalance={dxtradeBalance || ''}
                    marketType='all'
                    platform='dxtrade'
                    renderButton={() => renderFooter}
                    title={`Your Deriv X${accountType === 'demo' ? ` ${accountType}` : ''} account is ready`}
                />
            );
        }
    }, [isSuccess, dxtradeAccountListSuccess, successDescription, dxtradeBalance, renderFooter, accountType]);

    const passwordComponent = useMemo(() => {
        if (!isSuccess && accountStatusSuccess) {
            return isDxtradePasswordNotSet ? (
                <CreatePassword
                    icon={<DxTradePasswordIcon />}
                    isLoading={isLoading}
                    onPasswordChange={e => setPassword(e.target.value)}
                    onPrimaryClick={onSubmit}
                    password={password}
                    platform='dxtrade'
                />
            ) : (
                <EnterPassword
                    isLoading={isLoading}
                    marketType='all'
                    onPasswordChange={e => setPassword(e.target.value)}
                    onPrimaryClick={onSubmit}
                    onSecondaryClick={() =>
                        show(
                            <ModalWrapper>
                                <SentEmailContent platform='dxtrade' />
                            </ModalWrapper>
                        )
                    }
                    password={password}
                    platform='dxtrade'
                />
            );
        }
    }, [isSuccess, accountStatusSuccess, show, isDxtradePasswordNotSet, isLoading, onSubmit, password]);

    if (isMobile) {
        return (
            <ModalStepWrapper renderFooter={() => renderFooter} title={' '}>
                {successComponent}
                {passwordComponent}
            </ModalStepWrapper>
        );
    }
    return (
        <ModalWrapper hideCloseButton={isSuccess}>
            {successComponent}
            {passwordComponent}
        </ModalWrapper>
    );
};

export default DxtradeEnterPasswordModal;
