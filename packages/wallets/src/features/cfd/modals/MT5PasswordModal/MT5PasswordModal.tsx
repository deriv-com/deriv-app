import React, { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    useAccountStatus,
    useActiveWalletAccount,
    useAvailableMT5Accounts,
    useCreateMT5Account,
    useMT5AccountsList,
    useSettings,
    useTradingPlatformPasswordChange,
} from '@deriv/api';
import { SentEmailContent, WalletError } from '../../../../components';
import { ModalStepWrapper, ModalWrapper, WalletButton, WalletButtonGroup } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import MT5PasswordIcon from '../../../../public/images/ic-mt5-password.svg';
import { TMarketTypes, TPlatforms } from '../../../../types';
import { companyNamesAndUrls, MarketTypeDetails, PlatformDetails } from '../../constants';
import { CFDSuccess, CreatePassword, EnterPassword } from '../../screens';

type TProps = {
    marketType: TMarketTypes.SortedMT5Accounts;
    platform: TPlatforms.All;
};

const MT5PasswordModal: React.FC<TProps> = ({ marketType, platform }) => {
    const [password, setPassword] = useState('');
    const { error, isLoading: createMT5AccountLoading, isSuccess, mutate, status } = useCreateMT5Account();
    const { isLoading: tradingPlatformPasswordChangeLoading, mutate: tradingPasswordChange } =
        useTradingPlatformPasswordChange();
    const { data: accountStatus } = useAccountStatus();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: mt5Accounts } = useMT5AccountsList();
    const { data: availableMT5Accounts } = useAvailableMT5Accounts();
    const { data: settings } = useSettings();
    const { getModalState, hide, show } = useModal();
    const { isMobile } = useDevice();
    const history = useHistory();

    const isMT5PasswordNotSet = accountStatus?.is_mt5_password_not_set;

    const hasMT5Account = mt5Accounts?.find(account => account.login);
    const isDemo = activeWallet?.is_virtual;
    const marketTypeTitle =
        marketType === 'all' && Object.keys(PlatformDetails).includes(platform)
            ? PlatformDetails[platform].title
            : MarketTypeDetails[marketType].title;
    const selectedJurisdiction = getModalState('selectedJurisdiction');

    const landingCompanyName = `(${
        companyNamesAndUrls?.[selectedJurisdiction as keyof typeof companyNamesAndUrls]?.shortcode
    })`;

    const onSubmit = useCallback(async () => {
        const accountType = marketType === 'synthetic' ? 'gaming' : marketType;

        // in order to create account, we need to set a password through trading_platform_password_change endpoint first
        // then only mt5_create_account can be called, otherwise it will response an error for password required
        if (isMT5PasswordNotSet) {
            await tradingPasswordChange({
                new_password: password,
                platform: 'mt5',
            });
        }

        const categoryAccountType = activeWallet?.is_virtual ? 'demo' : accountType;

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

    const renderTitle = useCallback(() => {
        if (isSuccess) {
            return ' ';
        }
        if (hasMT5Account) {
            return `Add a ${isDemo ? 'demo' : 'real'} ${PlatformDetails.mt5.title} account`;
        }
        return `Create a ${isDemo ? 'demo' : 'real'} ${PlatformDetails.mt5.title} account`;
    }, [hasMT5Account, isDemo, isSuccess]);

    const renderSuccessButton = useCallback(() => {
        if (isDemo) {
            return <WalletButton isFullWidth onClick={() => hide()} size='lg' text='Continue' />;
        }
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
    }, [history, isDemo, hide]);

    const renderFooter = useCallback(() => {
        if (isSuccess) return renderSuccessButton();
        if (hasMT5Account)
            return (
                <WalletButtonGroup isFullWidth>
                    <WalletButton
                        isFullWidth
                        onClick={() => {
                            show(
                                <ModalStepWrapper title="We've sent you an email">
                                    <SentEmailContent platform={platform} />
                                </ModalStepWrapper>
                            );
                        }}
                        size='lg'
                        text='Forgot password?'
                        variant='outlined'
                    />
                    <WalletButton
                        disabled={!password || createMT5AccountLoading || tradingPlatformPasswordChangeLoading}
                        isFullWidth
                        isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                        onClick={onSubmit}
                        size='lg'
                        text='Add account'
                    />
                </WalletButtonGroup>
            );
        return (
            <WalletButton
                disabled={!password || createMT5AccountLoading || tradingPlatformPasswordChangeLoading}
                isFullWidth
                isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                onClick={onSubmit}
                size='lg'
                text='Create Deriv MT5 password'
            />
        );
    }, [
        createMT5AccountLoading,
        hasMT5Account,
        isSuccess,
        onSubmit,
        password,
        platform,
        renderSuccessButton,
        show,
        tradingPlatformPasswordChangeLoading,
    ]);

    const passwordComponent = useMemo(() => {
        if (!isSuccess)
            return isMT5PasswordNotSet ? (
                <CreatePassword
                    icon={<MT5PasswordIcon />}
                    isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                    onPasswordChange={e => setPassword(e.target.value)}
                    onPrimaryClick={onSubmit}
                    password={password}
                    platform='mt5'
                />
            ) : (
                <EnterPassword
                    isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                    marketType={marketType}
                    onPasswordChange={e => setPassword(e.target.value)}
                    onPrimaryClick={onSubmit}
                    onSecondaryClick={() =>
                        show(
                            <ModalWrapper>
                                <SentEmailContent platform={platform} />
                            </ModalWrapper>
                        )
                    }
                    password={password}
                    platform='mt5'
                />
            );
    }, [
        createMT5AccountLoading,
        isMT5PasswordNotSet,
        isSuccess,
        marketType,
        onSubmit,
        password,
        platform,
        show,
        tradingPlatformPasswordChangeLoading,
    ]);

    const successComponent = useMemo(() => {
        const renderSuccessDescription = () => {
            if (isDemo) {
                return `You can now start practicing trading with your ${marketTypeTitle} demo account.`;
            }
            return `Transfer funds from your ${activeWallet?.wallet_currency_type} Wallet to your ${marketTypeTitle} ${landingCompanyName} account to start trading.`;
        };
        if (isSuccess) {
            return (
                <CFDSuccess
                    description={renderSuccessDescription()}
                    displayBalance={
                        mt5Accounts?.find(account => account.market_type === marketType)?.display_balance ?? '0.00'
                    }
                    landingCompany={selectedJurisdiction}
                    marketType={marketType}
                    platform={platform}
                    renderButton={renderSuccessButton}
                    title={`Your ${marketTypeTitle} ${isDemo ? ' demo' : landingCompanyName} account is ready`}
                />
            );
        }
    }, [
        isSuccess,
        isDemo,
        activeWallet?.wallet_currency_type,
        marketTypeTitle,
        landingCompanyName,
        mt5Accounts,
        selectedJurisdiction,
        marketType,
        platform,
        renderSuccessButton,
    ]);

    if (status === 'error') {
        return <WalletError errorMessage={error?.error.message} onClick={() => hide()} title={error?.error?.code} />;
    }

    if (isMobile) {
        return (
            <ModalStepWrapper renderFooter={renderFooter} title={renderTitle()}>
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

export default MT5PasswordModal;
