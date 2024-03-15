import React, { useCallback, useMemo, useState } from 'react';
import {
    useAccountStatus,
    useActiveWalletAccount,
    useAvailableMT5Accounts,
    useCreateMT5Account,
    useMT5AccountsList,
    useSettings,
    useTradingPlatformPasswordChange,
} from '@deriv/api-v2';
import { SentEmailContent, WalletError } from '../../../../components';
import { ModalStepWrapper, ModalWrapper, WalletButton } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import MT5PasswordIcon from '../../../../public/images/ic-mt5-password.svg';
import { TMarketTypes, TPlatforms } from '../../../../types';
import { validPassword } from '../../../../utils/password-validation';
import { PlatformDetails } from '../../constants';
import { CreatePassword, EnterPassword, MT5ResetPasswordModal } from '../../screens';
import MT5AccountAdded from '../MT5AccountAdded/MT5AccountAdded';
import { MT5PasswordModalFooter, SuccessModalFooter } from './MT5PasswordModalFooters';

type TProps = {
    marketType: TMarketTypes.SortedMT5Accounts;
    platform: TPlatforms.All;
};

const MT5PasswordModal: React.FC<TProps> = ({ marketType, platform }) => {
    const [password, setPassword] = useState('');
    const {
        data: newMT5Account,
        error,
        isLoading: createMT5AccountLoading,
        isSuccess,
        mutate,
        status,
    } = useCreateMT5Account();
    const { isLoading: tradingPlatformPasswordChangeLoading, mutateAsync: tradingPasswordChange } =
        useTradingPlatformPasswordChange();
    const { data: accountStatus } = useAccountStatus();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: availableMT5Accounts } = useAvailableMT5Accounts();
    const { isMobile } = useDevice();
    const { data: mt5Accounts } = useMT5AccountsList();
    const { getModalState, hide, show } = useModal();
    const { data: settings } = useSettings();
    const isMT5PasswordNotSet = accountStatus?.is_mt5_password_not_set;
    const hasMT5Account = mt5Accounts?.find(account => account.login);
    const isDemo = activeWallet?.is_virtual;
    const selectedJurisdiction = getModalState('selectedJurisdiction');
    const { platform: mt5Platform, title: mt5Title } = PlatformDetails.mt5;

    const onSubmit = useCallback(async () => {
        const accountType = marketType === 'synthetic' ? 'gaming' : marketType;
        const categoryAccountType = activeWallet?.is_virtual ? 'demo' : accountType;

        // In order to create account, we need to set a password through trading_platform_password_change endpoint first
        // hen only mt5_create_account can be called, otherwise it will response an error for password required
        if (isMT5PasswordNotSet) {
            await tradingPasswordChange({
                new_password: password,
                platform: mt5Platform,
            });
        }

        mutate({
            payload: {
                account_type: categoryAccountType,
                address: settings?.address_line_1 ?? '',
                city: settings?.address_city ?? '',
                company: selectedJurisdiction,
                country: settings?.country_code ?? '',
                email: settings?.email ?? '',
                leverage: availableMT5Accounts?.find(acc => acc.market_type === marketType)?.leverage ?? 500,
                mainPassword: password,
                ...(marketType === 'financial' && { mt5_account_type: 'financial' }),
                ...(selectedJurisdiction &&
                    (selectedJurisdiction !== 'labuan'
                        ? {
                              account_type: categoryAccountType,
                              ...(selectedJurisdiction === 'financial' && { mt5_account_type: 'financial' }),
                          }
                        : {
                              account_type: 'financial',
                              mt5_account_type: 'financial_stp',
                          })),
                ...(marketType === 'all' && { sub_account_category: 'swap_free' }),
                name: settings?.first_name ?? '',
                phone: settings?.phone ?? '',
                state: settings?.address_state ?? '',
                zipCode: settings?.address_postcode ?? '',
            },
        });
    }, [
        activeWallet?.is_virtual,
        availableMT5Accounts,
        isMT5PasswordNotSet,
        marketType,
        mt5Platform,
        mutate,
        password,
        selectedJurisdiction,
        settings?.address_city,
        settings?.address_line_1,
        settings?.address_postcode,
        settings?.address_state,
        settings?.country_code,
        settings?.email,
        settings?.first_name,
        settings?.phone,
        tradingPasswordChange,
    ]);

    const sendEmailVerification = useCallback(
        (platform: TPlatforms.All) => {
            show(
                <ModalStepWrapper>
                    <SentEmailContent platform={platform} />
                </ModalStepWrapper>
            );
        },
        [show]
    );

    const renderTitle = useCallback(() => {
        const action = hasMT5Account ? 'Add' : 'Create';
        const accountType = isDemo ? 'demo' : 'real';

        return `${action} a ${accountType} ${mt5Title} account`;
    }, [hasMT5Account, isDemo, mt5Title]);

    const renderFooter = useCallback(() => {
        if (isSuccess) return <SuccessModalFooter isDemo={isDemo} />;
        if (hasMT5Account)
            return (
                <MT5PasswordModalFooter
                    disabled={
                        !password ||
                        createMT5AccountLoading ||
                        tradingPlatformPasswordChangeLoading ||
                        !validPassword(password)
                    }
                    isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                    onPrimaryClick={onSubmit}
                    onSecondaryClick={() => sendEmailVerification(platform)}
                />
            );
        return (
            <WalletButton
                disabled={
                    !password ||
                    createMT5AccountLoading ||
                    tradingPlatformPasswordChangeLoading ||
                    !validPassword(password)
                }
                isFullWidth
                isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                onClick={onSubmit}
                size='lg'
            >
                Create Deriv MT5 password
            </WalletButton>
        );
    }, [
        createMT5AccountLoading,
        hasMT5Account,
        isDemo,
        isSuccess,
        onSubmit,
        password,
        platform,
        sendEmailVerification,
        tradingPlatformPasswordChangeLoading,
    ]);

    const PasswordComponent = useMemo(() => {
        return isMT5PasswordNotSet ? (
            <CreatePassword
                icon={<MT5PasswordIcon />}
                isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                onPasswordChange={e => setPassword(e.target.value)}
                onPrimaryClick={onSubmit}
                password={password}
                platform={mt5Platform}
            />
        ) : (
            <EnterPassword
                isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                marketType={marketType}
                onPasswordChange={e => setPassword(e.target.value)}
                onPrimaryClick={onSubmit}
                onSecondaryClick={() => sendEmailVerification(platform)}
                password={password}
                passwordError={error?.error?.code === 'PasswordError'}
                platform={mt5Platform}
            />
        );
    }, [
        createMT5AccountLoading,
        error?.error?.code,
        isMT5PasswordNotSet,
        marketType,
        mt5Platform,
        onSubmit,
        password,
        platform,
        sendEmailVerification,
        tradingPlatformPasswordChangeLoading,
    ]);

    if (status === 'error') {
        if (
            error?.error?.code === 'InvalidTradingPlatformPasswordFormat' ||
            error?.error?.code === 'IncorrectMT5PasswordFormat'
        )
            return (
                <MT5ResetPasswordModal
                    onClickSuccess={onSubmit}
                    sendEmailVerification={() => sendEmailVerification(platform)}
                    setPassword={setPassword}
                    successButtonLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                />
            );
        else if (error?.error?.code !== 'PasswordError')
            return <WalletError errorMessage={error?.error.message} onClick={hide} title={error?.error?.code} />;
    }

    if (isMobile) {
        return (
            <ModalStepWrapper renderFooter={renderFooter} title={renderTitle()}>
                {PasswordComponent}
            </ModalStepWrapper>
        );
    }

    if (isSuccess) {
        return <MT5AccountAdded account={newMT5Account} marketType={marketType} platform={platform} />;
    }

    return <ModalWrapper hideCloseButton={isSuccess}>{PasswordComponent}</ModalWrapper>;
};

export default MT5PasswordModal;
