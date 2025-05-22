import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    useAccountStatus,
    useActiveWalletAccount,
    useCreateOtherCFDAccount,
    useDxtradeAccountsList,
} from '@deriv/api-v2';
import { useTranslations } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { SentEmailContent, WalletError } from '../../../../components';
import { ModalWrapper } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import useSendPasswordResetEmail from '../../../../hooks/useSendPasswordResetEmail';
import { PlatformDetails } from '../../constants';
import { CreatePasswordModal } from '../CreatePasswordModal';
import { EnterPasswordModal } from '../EnterPasswordModal';
import { PasswordLimitExceededModal } from '../PasswordLimitExceededModal';
import { SuccessModal } from '../SuccessModal';
import './DxtradeEnterPasswordModal.scss';

const DxtradeEnterPasswordModal = () => {
    const history = useHistory();
    const { isDesktop } = useDevice();
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
    const { localize } = useTranslations();

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

    const dxtradeBalance = useMemo(() => {
        return dxtradeAccount?.find(account => account.market_type === 'all')?.display_balance;
    }, [dxtradeAccount]);

    const successDescription = useMemo(() => {
        return accountType === 'demo'
            ? localize('Practise trading with {{dxtradeBalance}} virtual funds.', { dxtradeBalance })
            : localize(
                  'Transfer funds from your {{currency}} Wallet to your {{dxtradeTitle}} account to start trading.',
                  { currency: activeWallet?.currency, dxtradeTitle: PlatformDetails.dxtrade.title }
              );
    }, [accountType, activeWallet?.currency, dxtradeBalance, localize]);

    useEffect(() => {
        if (!isResetPasswordSuccessful) return;
        if (!isDxtradePasswordNotSet) {
            show(
                <ModalWrapper isFullscreen={!isDesktop}>
                    <SentEmailContent isForgottenPassword onErrorButtonClick={hide} platform={dxtradePlatform} />
                </ModalWrapper>
            );
        }
    }, [dxtradePlatform, hide, isDxtradePasswordNotSet, isDesktop, isResetPasswordSuccessful, show]);

    if (status === 'error' && error?.error?.code === 'PasswordReset') {
        return (
            <PasswordLimitExceededModal
                onPrimaryClick={hide}
                onSecondaryClick={() => {
                    sendEmail({
                        platform: dxtradePlatform,
                    });
                }}
            />
        );
    }
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

    if (!isCreateAccountSuccessful && accountStatusSuccess) {
        return isDxtradePasswordNotSet ? (
            <CreatePasswordModal
                isLoading={isLoading}
                onPasswordChange={e => setPassword(e.target.value)}
                onPrimaryClick={onSubmit}
                password={password}
                platform={dxtradePlatform}
            />
        ) : (
            <EnterPasswordModal
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
    if (isCreateAccountSuccessful && dxtradeAccountListSuccess) {
        return (
            <SuccessModal
                description={successDescription}
                displayBalance={dxtradeBalance ?? ''}
                isDemo={activeWallet?.is_virtual}
                marketType='all'
                onPrimaryClick={() => {
                    hide();
                    history.push('/wallet/account-transfer', { toAccountLoginId: createdAccount?.account_id });
                }}
                onSecondaryClick={hide}
                platform={dxtradePlatform}
            />
        );
    }
    return null;
};

export default DxtradeEnterPasswordModal;
