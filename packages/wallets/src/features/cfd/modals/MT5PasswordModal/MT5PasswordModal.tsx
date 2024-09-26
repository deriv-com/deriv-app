import React, { useCallback, useMemo, useState } from 'react';
import {
    useAccountStatus,
    useActiveWalletAccount,
    useAvailableMT5Accounts,
    useCreateMT5Account,
    useMT5AccountsList,
    useSettings,
    useTradingPlatformPasswordChange,
    useVerifyEmail,
} from '@deriv/api-v2';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, useDevice, Loader } from '@deriv-com/ui';
import { SentEmailContent, WalletError } from '../../../../components';
import { ModalStepWrapper, ModalWrapper } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import { THooks, TMarketTypes, TPlatforms } from '../../../../types';
import { platformPasswordResetRedirectLink } from '../../../../utils/cfd';
import { validPassword, validPasswordMT5 } from '../../../../utils/password-validation';
import { CFD_PLATFORMS, JURISDICTION, MARKET_TYPE, PlatformDetails, PRODUCT } from '../../constants';
import { CreatePassword, CreatePasswordMT5, EnterPassword, MT5ResetPasswordModal } from '../../screens';
import MT5AccountAdded from '../MT5AccountAdded/MT5AccountAdded';
import { PasswordLimitExceededModal } from '../PasswordLimitExceededModal';
import { MT5PasswordModalFooter, SuccessModalFooter } from './MT5PasswordModalFooters';
import './MT5PasswordModal.scss';

type TProps = {
    isVirtual?: boolean;
    marketType: TMarketTypes.SortedMT5Accounts;
    platform: TPlatforms.All;
    product?: THooks.AvailableMT5Accounts['product'];
};

export type TPlatformPasswordChange = {
    currentPassword: string;
    newPassword: string;
};

const MT5PasswordModal: React.FC<TProps> = ({ isVirtual, marketType, platform, product }) => {
    const [isTncChecked, setIsTncChecked] = useState(!(product === PRODUCT.ZEROSPREAD && !isVirtual));
    const {
        data: createMT5AccountData,
        error: createMT5AccountError,
        isLoading: createMT5AccountLoading,
        isSuccess: createMT5AccountSuccess,
        mutate: createMT5AccountMutate,
        status: createMT5AccountStatus,
    } = useCreateMT5Account();
    const {
        error: tradingPasswordChangeError,
        isLoading: tradingPlatformPasswordChangeLoading,
        mutateAsync: tradingPasswordChangeMutateAsync,
    } = useTradingPlatformPasswordChange();
    const { data: accountStatusData, isLoading: accountStatusLoading } = useAccountStatus();
    const { data: activeWalletData } = useActiveWalletAccount();
    const { data: availableMT5AccountsData } = useAvailableMT5Accounts();
    const {
        error: emailVerificationError,
        mutate: emailVerificationMutate,
        status: emailVerificationStatus,
    } = useVerifyEmail();
    const { data: mt5AccountsData } = useMT5AccountsList();
    const { isDesktop } = useDevice();
    const { getModalState, hide } = useModal();
    const { data: settingsData } = useSettings();
    const { localize } = useTranslations();

    const { email } = settingsData;

    const [password, setPassword] = useState('');

    const isMT5PasswordNotSet = accountStatusData?.is_mt5_password_not_set;
    const hasMT5Account = mt5AccountsData?.find(account => account.login);
    const isDemo = activeWalletData?.is_virtual;
    const { platform: mt5Platform, title: mt5Title } = PlatformDetails.mt5;
    const selectedJurisdiction = isDemo ? JURISDICTION.SVG : getModalState('selectedJurisdiction');

    const isLoading = accountStatusLoading || createMT5AccountLoading || tradingPlatformPasswordChangeLoading;

    const updateMT5Password =
        createMT5AccountStatus === 'error' &&
        (createMT5AccountError?.error?.code === 'InvalidTradingPlatformPasswordFormat' ||
            createMT5AccountError?.error?.code === 'IncorrectMT5PasswordFormat');

    const onSubmit = useCallback(async () => {
        // ====== Create MT5 Account ======
        // In order to create account, we need to set a password through trading_platform_password_change endpoint first,
        // then only mt5_create_account can be called, otherwise it will response an error for password required.
        // =================================

        const accountType = marketType === MARKET_TYPE.SYNTHETIC ? 'gaming' : marketType;
        const categoryAccountType = isDemo ? 'demo' : accountType;

        if (isMT5PasswordNotSet) {
            await tradingPasswordChangeMutateAsync({
                new_password: password,
                platform: mt5Platform,
            });
        }

        createMT5AccountMutate({
            payload: {
                account_type: categoryAccountType,
                address: settingsData?.address_line_1 ?? '',
                city: settingsData?.address_city ?? '',
                country: settingsData?.country_code ?? '',
                email: settingsData?.email ?? '',
                leverage: availableMT5AccountsData?.find(acc => acc.market_type === marketType)?.leverage ?? 500,
                mainPassword: password,
                ...(selectedJurisdiction && !isDemo ? { company: selectedJurisdiction } : {}),
                ...(marketType === MARKET_TYPE.FINANCIAL && { mt5_account_type: MARKET_TYPE.FINANCIAL }),
                ...(selectedJurisdiction &&
                    (selectedJurisdiction !== JURISDICTION.LABUAN
                        ? {
                              account_type: categoryAccountType,
                              ...(selectedJurisdiction === MARKET_TYPE.FINANCIAL && {
                                  mt5_account_type: MARKET_TYPE.FINANCIAL,
                              }),
                          }
                        : {
                              account_type: MARKET_TYPE.FINANCIAL,
                              mt5_account_type: 'financial_stp',
                          })),
                ...(marketType === MARKET_TYPE.ALL && { product }),
                name: settingsData?.first_name ?? '',
                phone: settingsData?.phone ?? '',
                state: settingsData?.address_state ?? '',
                zipCode: settingsData?.address_postcode ?? '',
            },
        });
    }, [
        availableMT5AccountsData,
        createMT5AccountMutate,
        isDemo,
        isMT5PasswordNotSet,
        marketType,
        mt5Platform,
        password,
        settingsData?.address_city,
        settingsData?.address_line_1,
        settingsData?.address_postcode,
        settingsData?.address_state,
        settingsData?.country_code,
        settingsData?.email,
        settingsData?.first_name,
        settingsData?.phone,
        tradingPasswordChangeMutateAsync,
        selectedJurisdiction,
        product,
    ]);

    const sendEmailVerification = useCallback(() => {
        if (email) {
            emailVerificationMutate({
                type: 'trading_platform_mt5_password_reset',
                url_parameters: {
                    redirect_to: platformPasswordResetRedirectLink(CFD_PLATFORMS.MT5, activeWalletData?.is_virtual),
                },
                verify_email: email,
            });
        }
    }, [activeWalletData?.is_virtual, email, emailVerificationMutate]);

    const onSubmitPasswordChange = useCallback(
        ({ currentPassword, newPassword }: TPlatformPasswordChange) => {
            tradingPasswordChangeMutateAsync({
                new_password: newPassword,
                old_password: currentPassword,
                platform: mt5Platform,
            });
            setPassword(newPassword);
        },
        [mt5Platform, tradingPasswordChangeMutateAsync]
    );

    const renderTitle = useCallback(() => {
        const accountAction = hasMT5Account ? localize('Add') : localize('Create');
        const accountType = isDemo ? localize('demo') : localize('real');

        return updateMT5Password
            ? localize('{{mt5Title}} latest password requirements', { mt5Title })
            : localize('{{accountAction}} a {{accountType}} {{mt5Title}} account', {
                  accountAction,
                  accountType,
                  mt5Title,
              });
    }, [hasMT5Account, isDemo, localize, mt5Title, updateMT5Password]);

    const renderFooter = useCallback(() => {
        if (createMT5AccountSuccess)
            return (
                <div className='wallets-mt5-password-modal__footer'>
                    <SuccessModalFooter isDemo={isDemo} />
                </div>
            );

        if (isMT5PasswordNotSet)
            return (
                <div className='wallets-mt5-password-modal__footer'>
                    <Button
                        disabled={
                            !password ||
                            createMT5AccountLoading ||
                            tradingPlatformPasswordChangeLoading ||
                            !validPasswordMT5(password) ||
                            !isTncChecked
                        }
                        isFullWidth
                        isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                        onClick={onSubmit}
                        size='lg'
                        textSize={isDesktop ? 'md' : 'sm'}
                    >
                        <Localize i18n_default_text='Create {{mt5Title}} password' values={{ mt5Title }} />
                    </Button>
                </div>
            );

        return (
            <div className='wallets-mt5-password-modal__footer'>
                <MT5PasswordModalFooter
                    disabled={
                        !password ||
                        createMT5AccountLoading ||
                        tradingPlatformPasswordChangeLoading ||
                        !validPassword(password) ||
                        !isTncChecked
                    }
                    isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                    onPrimaryClick={onSubmit}
                    onSecondaryClick={() => sendEmailVerification()}
                />
            </div>
        );
    }, [
        createMT5AccountLoading,
        createMT5AccountSuccess,
        isDemo,
        isDesktop,
        isMT5PasswordNotSet,
        mt5Title,
        onSubmit,
        password,
        sendEmailVerification,
        tradingPlatformPasswordChangeLoading,
        isTncChecked,
    ]);

    const PasswordComponent = useMemo(() => {
        if (isLoading) return <Loader />;

        if (isMT5PasswordNotSet && platform !== CFD_PLATFORMS.MT5)
            return (
                <CreatePassword
                    isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                    onPasswordChange={e => setPassword(e.target.value)}
                    onPrimaryClick={onSubmit}
                    password={password}
                    platform={mt5Platform}
                />
            );

        if (isMT5PasswordNotSet && platform === CFD_PLATFORMS.MT5)
            return (
                <CreatePasswordMT5
                    isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                    isTncChecked={isTncChecked}
                    isVirtual={isVirtual}
                    onPasswordChange={e => setPassword(e.target.value)}
                    onPrimaryClick={onSubmit}
                    onTncChange={() => {
                        setIsTncChecked(prev => !prev);
                    }}
                    password={password}
                    platform={mt5Platform}
                    product={product}
                />
            );

        if (updateMT5Password)
            return (
                <MT5ResetPasswordModal
                    formError={tradingPasswordChangeError}
                    isLoading={tradingPlatformPasswordChangeLoading}
                    onClickSubmitPasswordChange={onSubmitPasswordChange}
                    sendEmailVerification={() => sendEmailVerification()}
                />
            );

        return (
            <EnterPassword
                isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                isTncChecked={isTncChecked}
                isVirtual={activeWalletData?.is_virtual}
                marketType={marketType}
                modalTitle={localize('Enter your Deriv MT5 password')}
                onPasswordChange={e => setPassword(e.target.value)}
                onPrimaryClick={onSubmit}
                onSecondaryClick={() => sendEmailVerification()}
                onTncChange={() => setIsTncChecked(prev => !prev)}
                password={password}
                passwordError={createMT5AccountError?.error?.code === 'PasswordError'}
                platform={mt5Platform}
                product={product}
                setPassword={setPassword}
            />
        );
    }, [
        isMT5PasswordNotSet,
        tradingPlatformPasswordChangeLoading,
        createMT5AccountLoading,
        isTncChecked,
        onSubmit,
        password,
        mt5Platform,
        updateMT5Password,
        tradingPasswordChangeError,
        platform,
        isVirtual,
        product,
        activeWalletData?.is_virtual,
        onSubmitPasswordChange,
        marketType,
        localize,
        createMT5AccountError?.error?.code,
        sendEmailVerification,
        setIsTncChecked,
        isLoading,
    ]);

    if (emailVerificationStatus === 'error') {
        return (
            <WalletError
                errorMessage={emailVerificationError?.error?.message ?? ''}
                onClick={hide}
                title={emailVerificationError?.error?.code ?? localize('Error')}
            />
        );
    }

    if (emailVerificationStatus === 'success') {
        return (
            <ModalWrapper isFullscreen={!isDesktop}>
                <SentEmailContent isForgottenPassword platform={CFD_PLATFORMS.MT5} />
            </ModalWrapper>
        );
    }

    if (createMT5AccountSuccess && !isMT5PasswordNotSet) {
        return (
            <MT5AccountAdded
                account={createMT5AccountData}
                marketType={marketType}
                platform={platform}
                product={product}
            />
        );
    }
    if (
        createMT5AccountStatus === 'error' &&
        createMT5AccountError?.error?.code === 'PasswordReset' &&
        !updateMT5Password
    ) {
        return <PasswordLimitExceededModal onPrimaryClick={hide} onSecondaryClick={() => sendEmailVerification()} />;
    }
    if (
        createMT5AccountStatus === 'error' &&
        createMT5AccountError?.error?.code !== 'PasswordError' &&
        !updateMT5Password
    ) {
        return (
            <WalletError
                errorMessage={createMT5AccountError?.error.message}
                onClick={hide}
                title={createMT5AccountError?.error?.code}
            />
        );
    }

    if (isDesktop) {
        return <ModalWrapper hideCloseButton={createMT5AccountSuccess}>{PasswordComponent}</ModalWrapper>;
    }

    return (
        <ModalStepWrapper renderFooter={!updateMT5Password ? renderFooter : undefined} title={renderTitle()}>
            <div className='wallets-mt5-password-modal__body'>{PasswordComponent}</div>
        </ModalStepWrapper>
    );
};

export default MT5PasswordModal;
