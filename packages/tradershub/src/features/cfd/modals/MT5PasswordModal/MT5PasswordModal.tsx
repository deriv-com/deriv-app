import React, { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    useAccountStatus,
    useActiveTradingAccount,
    useAvailableMT5Accounts,
    useCreateMT5Account,
    useMT5AccountsList,
    useSettings,
    useTradingPlatformPasswordChange,
} from '@deriv/api';
import { Provider } from '@deriv/library';
import { Button, useBreakpoint } from '@deriv/quill-design';
import { ActionScreen, ButtonGroup, Dialog, ModalStepWrapper } from '../../../../components';
import MT5PasswordIcon from '../../../../public/images/ic-mt5-password.svg';
import { TMarketTypes, TPlatforms } from '../../../../types';
import { validPassword } from '../../../../utils/password';
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
    const { data: ActiveTradingAccount } = useActiveTradingAccount();
    const { data: mt5Accounts } = useMT5AccountsList();
    const { data: availableMT5Accounts } = useAvailableMT5Accounts();
    const { data: settings } = useSettings();
    const { getModalState, hide, show } = Provider.useModal();
    const { isMobile } = useBreakpoint();
    const history = useHistory();

    const isMT5PasswordNotSet = accountStatus?.is_mt5_password_not_set;

    const hasMT5Account = mt5Accounts?.find(account => account.login);
    const isDemo = ActiveTradingAccount?.is_virtual;
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
                platform: PlatformDetails.mt5.platform,
            });
        }

        const categoryAccountType = ActiveTradingAccount?.is_virtual ? 'demo' : accountType;

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
        ActiveTradingAccount?.is_virtual,
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
            return (
                <div className='w-5000 sm:w-full'>
                    <Button className='w-full' onClick={hide} size='lg'>
                        OK
                    </Button>
                </div>
            );
        }
        return (
            <ButtonGroup className='justify-center w-full'>
                <Button onClick={hide} size='lg' variant='secondary'>
                    Maybe later
                </Button>
                <Button
                    onClick={() => {
                        hide();
                        history.push('/wallets/cashier/transfer');
                    }}
                    size='lg'
                >
                    Transfer funds
                </Button>
            </ButtonGroup>
        );
    }, [history, isDemo, hide]);

    const renderFooter = useCallback(() => {
        if (isSuccess) return renderSuccessButton();
        if (hasMT5Account)
            return (
                <ButtonGroup className='w-full'>
                    <Button
                        className='w-full'
                        onClick={() => {
                            show(
                                <ModalStepWrapper title="We've sent you an email">
                                    {/* <SentEmailContent platform={platform} /> */}
                                </ModalStepWrapper>
                            );
                        }}
                        size='lg'
                        variant='secondary'
                    >
                        Forgot password?
                    </Button>
                    <Button
                        className='w-full'
                        disabled={!password || createMT5AccountLoading || tradingPlatformPasswordChangeLoading}
                        isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                        onClick={onSubmit}
                        size='lg'
                    >
                        Add account
                    </Button>
                </ButtonGroup>
            );
        return (
            <Button
                className='w-full'
                disabled={
                    !password ||
                    createMT5AccountLoading ||
                    tradingPlatformPasswordChangeLoading ||
                    !validPassword(password)
                }
                isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                onClick={onSubmit}
                size='lg'
            >
                Create Deriv MT5 password
            </Button>
        );
    }, [
        createMT5AccountLoading,
        hasMT5Account,
        isSuccess,
        onSubmit,
        password,
        renderSuccessButton,
        show,
        tradingPlatformPasswordChangeLoading,
    ]);

    const successComponent = useMemo(() => {
        const renderSuccessDescription = () => {
            return isDemo
                ? `Let's practise trading with ${ActiveTradingAccount?.display_balance} virtual funds.`
                : `Transfer funds from your ${ActiveTradingAccount?.currency} Wallet to your ${marketTypeTitle} ${landingCompanyName} account to start trading.`;
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
                    platform='mt5'
                    renderButtons={renderSuccessButton}
                    title={`Your ${marketTypeTitle} ${isDemo ? ' demo' : landingCompanyName} account is ready`}
                />
            );
        }
    }, [
        isSuccess,
        isDemo,
        ActiveTradingAccount?.currency,
        ActiveTradingAccount?.display_balance,
        marketTypeTitle,
        landingCompanyName,
        mt5Accounts,
        selectedJurisdiction,
        marketType,
        renderSuccessButton,
    ]);

    const passwordComponent = useMemo(() => {
        if (!isSuccess) {
            return isMT5PasswordNotSet ? (
                <CreatePassword
                    icon={<MT5PasswordIcon />}
                    isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                    onPasswordChange={e => setPassword(e.target.value)}
                    onPrimaryClick={onSubmit}
                    password={password}
                    platform={PlatformDetails.mt5.platform}
                />
            ) : (
                <EnterPassword
                    isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                    marketType={marketType}
                    onPasswordChange={e => setPassword(e.target.value)}
                    onPrimaryClick={onSubmit}
                    // onSecondaryClick={() => <show SentEmailContent platform={platform} />}
                    password={password}
                    passwordError={error?.error?.code === 'PasswordError'}
                    platform={PlatformDetails.mt5.platform}
                />
            );
        }
    }, [
        createMT5AccountLoading,
        error?.error?.code,
        isMT5PasswordNotSet,
        isSuccess,
        marketType,
        onSubmit,
        password,
        tradingPlatformPasswordChangeLoading,
    ]);

    if (status === 'error' && error?.error?.code !== 'PasswordError') {
        return <ActionScreen description={error?.error.message} title={error?.error?.code} />;
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
        <Dialog>
            <Dialog.Header />
            <Dialog.Content>
                {successComponent}
                {passwordComponent}
            </Dialog.Content>
        </Dialog>
    );
};

export default MT5PasswordModal;
