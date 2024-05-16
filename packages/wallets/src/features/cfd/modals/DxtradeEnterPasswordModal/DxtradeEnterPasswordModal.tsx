import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    useAccountStatus,
    useActiveWalletAccount,
    useCreateOtherCFDAccount,
    useDxtradeAccountsList,
} from '@deriv/api-v2';
import { SentEmailContent, WalletError } from '../../../../components';
import { ModalStepWrapper, ModalWrapper, WalletButton, WalletButtonGroup } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import useSendPasswordResetEmail from '../../../../hooks/useSendPasswordResetEmail';
import { PlatformDetails } from '../../constants';
import { CFDSuccess, CreatePassword, EnterPassword } from '../../screens';
import './DxtradeEnterPasswordModal.scss';

const DxtradeEnterPasswordModal = () => {
    const history = useHistory();
    const { isMobile } = useDevice();
    const [password, setPassword] = useState('');
    const { data: getAccountStatus, isSuccess: accountStatusSuccess } = useAccountStatus();
    const {
        data: createdAccount,
        error,
        isLoading,
        isSuccess: isCreateAccountSuccessful,
        mutateAsync,
        status,
    } = useCreateOtherCFDAccount();

    const { data: dxtradeAccount, isSuccess: dxtradeAccountListSuccess } = useDxtradeAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();
    const {
        error: resetPasswordError,
        isLoading: isResetPasswordLoading,
        isSuccess: isResetPasswordSuccessful,
        sendEmail,
    } = useSendPasswordResetEmail();
    const { hide, show } = useModal();
    const accountType = activeWallet?.is_virtual ? 'demo' : 'real';
    const dxtradePlatform = PlatformDetails.dxtrade.platform;

    const isDxtradePasswordNotSet = getAccountStatus?.is_dxtrade_password_not_set;

    const onSubmit = useCallback(async () => {
        await mutateAsync({
            payload: {
                account_type: accountType,
                market_type: 'all',
                password,
                platform: dxtradePlatform,
            },
        }).catch(() => setPassword(''));
    }, [mutateAsync, accountType, password, dxtradePlatform]);

    const successDescription = useMemo(() => {
        return accountType === 'demo'
            ? `Let's practise trading with ${activeWallet?.display_balance} virtual funds.`
            : `Transfer funds from your ${activeWallet?.currency} Wallet to your ${PlatformDetails.dxtrade.title} account to start trading.`;
    }, [accountType, activeWallet?.currency, activeWallet?.display_balance]);

    useEffect(() => {
        if (!isResetPasswordSuccessful) return;
        if (!isDxtradePasswordNotSet && isMobile) {
            show(
                <ModalStepWrapper title="We've sent you an email">
                    <SentEmailContent onErrorButtonClick={hide} platform={dxtradePlatform} />
                </ModalStepWrapper>
            );
        } else if (!isDxtradePasswordNotSet) {
            show(
                <ModalWrapper>
                    <SentEmailContent onErrorButtonClick={hide} platform={dxtradePlatform} />
                </ModalWrapper>
            );
        }
    }, [dxtradePlatform, hide, isDxtradePasswordNotSet, isMobile, isResetPasswordSuccessful, show]);

    const dxtradeBalance = useMemo(() => {
        return dxtradeAccount?.find(account => account.market_type === 'all')?.display_balance;
    }, [dxtradeAccount]);

    const renderFooter = useMemo(() => {
        if (isCreateAccountSuccessful) {
            if (accountType === 'demo') {
                return (
                    <div className='wallets-success-btn'>
                        <WalletButton isFullWidth onClick={hide} size={isMobile ? 'lg' : 'md'}>
                            OK
                        </WalletButton>
                    </div>
                );
            }
            return (
                <WalletButtonGroup isFlex isFullWidth>
                    <WalletButton onClick={() => hide()} size={isMobile ? 'lg' : 'md'} variant='outlined'>
                        Maybe later
                    </WalletButton>
                    <WalletButton
                        onClick={() => {
                            hide();
                            history.push('/wallets/cashier/transfer', { toAccountLoginId: createdAccount?.account_id });
                        }}
                        size={isMobile ? 'lg' : 'md'}
                    >
                        Transfer funds
                    </WalletButton>
                </WalletButtonGroup>
            );
        }

        if (!isDxtradePasswordNotSet) {
            return (
                <WalletButtonGroup isFullWidth>
                    <WalletButton
                        isFullWidth
                        isLoading={isResetPasswordLoading}
                        onClick={() => {
                            sendEmail({
                                platform: dxtradePlatform,
                            });
                        }}
                        size={isMobile ? 'lg' : 'md'}
                        variant='outlined'
                    >
                        Forgot password?
                    </WalletButton>
                    <WalletButton
                        disabled={!password || isLoading}
                        isFullWidth
                        isLoading={isLoading}
                        onClick={onSubmit}
                        size={isMobile ? 'lg' : 'md'}
                    >
                        Add account
                    </WalletButton>
                </WalletButtonGroup>
            );
        }

        return (
            <WalletButton
                disabled={!password || isLoading}
                isFullWidth
                isLoading={isLoading}
                onClick={onSubmit}
                size={isMobile ? 'lg' : 'md'}
            >
                {`Create ${PlatformDetails.dxtrade.title} password`}
            </WalletButton>
        );
    }, [
        accountType,
        createdAccount?.account_id,
        dxtradePlatform,
        hide,
        history,
        isCreateAccountSuccessful,
        isDxtradePasswordNotSet,
        isLoading,
        isMobile,
        isResetPasswordLoading,
        onSubmit,
        password,
        sendEmail,
    ]);

    const successComponent = useMemo(() => {
        if (isCreateAccountSuccessful && dxtradeAccountListSuccess) {
            return (
                <CFDSuccess
                    description={successDescription}
                    displayBalance={dxtradeBalance ?? ''}
                    marketType='all'
                    platform={dxtradePlatform}
                    renderButton={() => renderFooter}
                    title={`Your ${PlatformDetails.dxtrade.title}${
                        accountType === 'demo' ? ` ${accountType}` : ''
                    } account is ready`}
                />
            );
        }
    }, [
        isCreateAccountSuccessful,
        dxtradeAccountListSuccess,
        successDescription,
        dxtradeBalance,
        dxtradePlatform,
        accountType,
        renderFooter,
    ]);

    const passwordComponent = useMemo(() => {
        if (!isCreateAccountSuccessful && accountStatusSuccess) {
            return isDxtradePasswordNotSet ? (
                <CreatePassword
                    isLoading={isLoading}
                    onPasswordChange={e => setPassword(e.target.value)}
                    onPrimaryClick={onSubmit}
                    password={password}
                    platform={dxtradePlatform}
                />
            ) : (
                <EnterPassword
                    isForgotPasswordLoading={isResetPasswordLoading}
                    isLoading={isLoading}
                    marketType='all'
                    onPasswordChange={e => setPassword(e.target.value)}
                    onPrimaryClick={onSubmit}
                    onSecondaryClick={() => {
                        sendEmail({
                            platform: dxtradePlatform,
                        });
                    }}
                    password={password}
                    passwordError={error?.error?.code === 'PasswordError'}
                    platform={dxtradePlatform}
                    setPassword={setPassword}
                />
            );
        }
    }, [
        isCreateAccountSuccessful,
        accountStatusSuccess,
        isDxtradePasswordNotSet,
        isLoading,
        onSubmit,
        password,
        dxtradePlatform,
        isResetPasswordLoading,
        error?.error?.code,
        sendEmail,
    ]);

    if (status === 'error' && error?.error?.code !== 'PasswordError') {
        return <WalletError errorMessage={error?.error.message} onClick={hide} title={error?.error?.code} />;
    }

    if (resetPasswordError) {
        return (
            <WalletError
                errorMessage={resetPasswordError?.error.message}
                onClick={hide}
                title={resetPasswordError?.error?.code}
            />
        );
    }

    if (isMobile) {
        return (
            <ModalStepWrapper renderFooter={() => renderFooter} title={' '}>
                {successComponent}
                {passwordComponent}
            </ModalStepWrapper>
        );
    }
    return (
        <ModalWrapper hideCloseButton={isCreateAccountSuccessful}>
            {successComponent}
            {passwordComponent}
        </ModalWrapper>
    );
};

export default DxtradeEnterPasswordModal;
