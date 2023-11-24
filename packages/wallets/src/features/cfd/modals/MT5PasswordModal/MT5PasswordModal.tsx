import React, { useState } from 'react';
import {
    useActiveWalletAccount,
    useAvailableMT5Accounts,
    useCreateMT5Account,
    useMT5AccountsList,
    useSettings,
    useTradingPlatformPasswordChange,
} from '@deriv/api';
import { SentEmailContent } from '../../../../components';
import { ModalStepWrapper, ModalWrapper, WalletButton, WalletButtonGroup } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import MT5PasswordIcon from '../../../../public/images/ic-mt5-password.svg';
import { TMarketTypes, TPlatforms } from '../../../../types';
import { MarketTypeDetails, PlatformDetails } from '../../constants';
import { CFDSuccess, CreatePassword, EnterPassword } from '../../screens';

type TProps = {
    marketType: TMarketTypes.SortedMT5Accounts;
    platform: TPlatforms.All;
};

const MT5PasswordModal: React.FC<TProps> = ({ marketType, platform }) => {
    const [password, setPassword] = useState('');
    const { isLoading: createMT5AccountLoading, isSuccess, mutate } = useCreateMT5Account();
    const { isLoading: tradingPlatformPasswordChangeLoading, mutate: tradingPasswordChange } =
        useTradingPlatformPasswordChange();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: mt5Accounts } = useMT5AccountsList();
    const { data: availableMT5Accounts } = useAvailableMT5Accounts();
    const { data: settings } = useSettings();
    const { getModalState, hide, show } = useModal();
    const { isMobile } = useDevice();

    const hasMT5Account = mt5Accounts?.find(account => account.login);
    const isDemo = activeWallet?.is_virtual;
    const marketTypeTitle =
        marketType === 'all' && Object.keys(PlatformDetails).includes(platform)
            ? PlatformDetails[platform].title
            : MarketTypeDetails[marketType].title;
    const selectedJurisdiction = getModalState('selectedJurisdiction');

    const onSubmit = async () => {
        const accountType = marketType === 'synthetic' ? 'gaming' : marketType;

        // in order to create account, we need to set a password through trading_platform_password_change endpoint first
        // then only mt5_create_account can be called, otherwise it will response an error for password required
        if (!mt5Accounts?.length) {
            await tradingPasswordChange({
                new_password: password,
                platform: 'mt5',
            });
        }

        const categoryAccountType = activeWallet?.is_virtual ? 'demo' : accountType;

        mutate({
            payload: {
                account_type: categoryAccountType,
                address: settings?.address_line_1 || '',
                city: settings?.address_city || '',
                company: selectedJurisdiction,
                country: settings?.country_code || '',
                email: settings?.email || '',
                leverage: availableMT5Accounts?.find(acc => acc.market_type === marketType)?.leverage || 500,
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
                name: settings?.first_name || '',
                phone: settings?.phone || '',
                state: settings?.address_state || '',
                zipCode: settings?.address_postcode || '',
            },
        });
    };

    const renderTitle = () => {
        if (isSuccess) {
            return ' ';
        }
        if (hasMT5Account) {
            return `Add a ${isDemo ? 'demo' : 'real'} ${PlatformDetails.mt5.title} account`;
        }
        return `Create a ${isDemo ? 'demo' : 'real'} ${PlatformDetails.mt5.title} account`;
    };

    const renderFooter = () => {
        if (isSuccess) return <WalletButton isFullWidth onClick={() => hide()} size='lg' text='Continue' />;
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
    };

    if (isMobile) {
        return (
            <ModalStepWrapper renderFooter={renderFooter} title={renderTitle()}>
                {/* TODO: We need to separate this out into a separate `show` modal call to hide the Deriv.app header */}
                {isSuccess && (
                    <CFDSuccess
                        description={`You can now start practicing trading with your ${marketTypeTitle} ${
                            isDemo ? ' demo' : 'real'
                        } account.`}
                        displayBalance={
                            mt5Accounts?.find(account => account.market_type === marketType)?.display_balance || ''
                        }
                        landingCompany={selectedJurisdiction}
                        marketType={marketType}
                        platform={platform}
                        renderButton={() => <WalletButton isFullWidth onClick={hide} size='lg' text='Continue' />}
                        title={`Your ${marketTypeTitle} ${isDemo ? ' demo' : 'real'} account is ready`}
                    />
                )}
                {!isSuccess &&
                    (hasMT5Account ? (
                        <EnterPassword
                            isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                            marketType={marketType}
                            onPasswordChange={e => setPassword(e.target.value)}
                            onPrimaryClick={onSubmit}
                            password={password}
                            platform='mt5'
                        />
                    ) : (
                        <CreatePassword
                            icon={<MT5PasswordIcon />}
                            isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                            onPasswordChange={e => setPassword(e.target.value)}
                            onPrimaryClick={onSubmit}
                            password={password}
                            platform='mt5'
                        />
                    ))}
            </ModalStepWrapper>
        );
    }

    return (
        <ModalWrapper hideCloseButton={isSuccess}>
            {isSuccess && (
                <CFDSuccess
                    description={`You can now start practicing trading with your ${marketTypeTitle} ${
                        isDemo ? ' demo' : 'real'
                    } account.`}
                    displayBalance={
                        mt5Accounts?.find(account => account.market_type === marketType)?.display_balance || ''
                    }
                    landingCompany={selectedJurisdiction}
                    marketType={marketType}
                    platform={platform}
                    renderButton={() => <WalletButton isFullWidth onClick={hide} size='lg' text='Continue' />}
                    title={`Your ${marketTypeTitle} ${isDemo ? ' demo' : 'real'} account is ready`}
                />
            )}
            {!isSuccess &&
                (hasMT5Account ? (
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
                ) : (
                    <CreatePassword
                        icon={<MT5PasswordIcon />}
                        isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                        onPasswordChange={e => setPassword(e.target.value)}
                        onPrimaryClick={onSubmit}
                        password={password}
                        platform='mt5'
                    />
                ))}
        </ModalWrapper>
    );
};

export default MT5PasswordModal;
