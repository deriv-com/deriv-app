import React, { useCallback, useMemo, useState } from 'react';
import {
    useAccountStatus,
    useAvailableMT5Accounts,
    useCreateMT5Account,
    useSettings,
    useTradingPlatformPasswordChange,
    useVerifyEmail,
} from '@deriv/api-v2';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Loader, useDevice } from '@deriv-com/ui';
import { SentEmailContent } from '../../../../components';
import { ModalStepWrapper, ModalWrapper } from '../../../../components/Base';
import { validatePassword } from '../../../../components/Base/WalletPasswordField/WalletPasswordField';
import { useModal } from '../../../../components/ModalProvider';
import { WalletSuccessChangeMT5Password } from '../../../../components/WalletsChangeMT5Password';
import { getPasswordErrorMessage } from '../../../../constants/password';
import { platformPasswordResetRedirectLink } from '../../../../utils/cfd';
import { validPasswordMT5 } from '../../../../utils/password-validation';
import { CFD_PLATFORMS, getMarketTypeDetails, JURISDICTION, MARKET_TYPE, PlatformDetails } from '../../constants';
import { CreatePassword, CreatePasswordMT5, EnterPassword, MT5ResetPasswordModal } from '../../screens';
import { TAvailableMT5Account } from '../../types';
import { MT5AccountAdded } from '../MT5AccountAdded';
import { MT5ErrorModal } from '../MT5ErrorModal';
import { PasswordLimitExceededModal } from '../PasswordLimitExceededModal';
import { MT5PasswordModalFooter } from './MT5PasswordModalFooters';
import './MT5PasswordModal.scss';

type TProps = {
    account: TAvailableMT5Account;
    isVirtual?: boolean;
};

export type TPlatformPasswordChange = {
    currentPassword: string;
    newPassword: string;
};

const MT5PasswordModal: React.FC<TProps> = ({ account, isVirtual = false }) => {
    const [isTncChecked, setIsTncChecked] = useState(
        // tnc is automatically checked for real SVG accounts and all demo accounts
        (account as TAvailableMT5Account).shortcode === JURISDICTION.SVG || isVirtual
    );
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
    const { data: availableMT5AccountsData } = useAvailableMT5Accounts();
    const {
        error: emailVerificationError,
        mutate: emailVerificationMutate,
        status: emailVerificationStatus,
    } = useVerifyEmail();
    const { isDesktop } = useDevice();
    const { getModalState, hide, setModalOptions } = useModal();
    const { data: settingsData } = useSettings();
    const { localize } = useTranslations();

    const {
        address_city: addressCity,
        address_line_1: addressLine1,
        address_postcode: addressPostcode,
        address_state: addressState,
        country_code: countryCode,
        email,
        first_name: firstName,
        phone,
    } = settingsData;

    const [password, setPassword] = useState('');
    const [isPasswordChanged, setIsPasswordChanged] = useState(false);

    const marketType = account.market_type ?? 'synthetic';
    const platform = account.platform;
    const product = account.product;
    const marketTypeTitle = getMarketTypeDetails(localize, product)[marketType].title;

    const isMT5PasswordNotSet = accountStatusData?.is_mt5_password_not_set;
    const { platform: mt5Platform, title } = PlatformDetails.mt5;
    const selectedJurisdiction = isVirtual ? JURISDICTION.SVG : getModalState('selectedJurisdiction');
    const { validationErrorMessage: validateMT5ErrorMessage } = validatePassword(password, true, localize);

    const isLoading = accountStatusLoading || createMT5AccountLoading || tradingPlatformPasswordChangeLoading;

    const updateMT5Password =
        createMT5AccountStatus === 'error' &&
        (createMT5AccountError?.error?.code === 'InvalidTradingPlatformPasswordFormat' ||
            createMT5AccountError?.error?.code === 'IncorrectMT5PasswordFormat');

    const createMT5Account = useCallback(() => {
        const accountType = marketType === MARKET_TYPE.SYNTHETIC ? 'gaming' : marketType;
        const categoryAccountType = isVirtual ? 'demo' : accountType;

        createMT5AccountMutate({
            payload: {
                account_type: categoryAccountType,
                address: addressLine1 ?? '',
                city: addressCity ?? '',
                country: countryCode ?? '',
                email: email ?? '',
                leverage: availableMT5AccountsData?.find(acc => acc.market_type === marketType)?.leverage ?? 500,
                mainPassword: password,
                ...(selectedJurisdiction && !isVirtual ? { company: selectedJurisdiction } : {}),
                ...(marketType === MARKET_TYPE.FINANCIAL && { mt5_account_type: MARKET_TYPE.FINANCIAL }),
                ...(selectedJurisdiction &&
                    (selectedJurisdiction !== JURISDICTION.LABUAN
                        ? {
                              account_type: categoryAccountType,
                              ...(marketType === MARKET_TYPE.FINANCIAL && {
                                  mt5_account_type: MARKET_TYPE.FINANCIAL,
                                  product,
                              }),
                          }
                        : {
                              account_type: MARKET_TYPE.FINANCIAL,
                              mt5_account_type: 'financial_stp',
                              product,
                          })),
                ...(marketType === MARKET_TYPE.ALL && { product }),
                name: firstName ?? '',
                phone: phone ?? '',
                state: addressState ?? '',
                zipCode: addressPostcode ?? '',
            },
        });
    }, [
        addressCity,
        addressLine1,
        addressPostcode,
        addressState,
        availableMT5AccountsData,
        countryCode,
        createMT5AccountMutate,
        email,
        firstName,
        isVirtual,
        marketType,
        password,
        phone,
        product,
        selectedJurisdiction,
    ]);

    const onSubmit = useCallback(async () => {
        // ====== Create MT5 Account ======
        // In order to create account, we need to set a password through trading_platform_password_change endpoint first,
        // then only mt5_create_account can be called, otherwise it will response an error for password required.
        // =================================

        if (isMT5PasswordNotSet) {
            await tradingPasswordChangeMutateAsync({
                new_password: password,
                platform: mt5Platform,
            });
        }

        createMT5Account();
    }, [createMT5Account, isMT5PasswordNotSet, mt5Platform, password, tradingPasswordChangeMutateAsync]);

    const sendEmailVerification = useCallback(() => {
        if (email) {
            emailVerificationMutate({
                type: 'trading_platform_mt5_password_reset',
                url_parameters: {
                    redirect_to: platformPasswordResetRedirectLink(CFD_PLATFORMS.MT5, isVirtual),
                },
                verify_email: email,
            });
        }
    }, [email, emailVerificationMutate, isVirtual]);

    const onSubmitPasswordChange = useCallback(
        ({ currentPassword, newPassword }: TPlatformPasswordChange) => {
            tradingPasswordChangeMutateAsync({
                new_password: newPassword,
                old_password: currentPassword,
                platform: mt5Platform,
            }).then(() => {
                setPassword(newPassword);
                setModalOptions(prev => ({ ...prev, shouldCloseOnClickOutside: false }));
                setIsPasswordChanged(true);
            });
        },
        [mt5Platform, setModalOptions, tradingPasswordChangeMutateAsync]
    );

    const renderTitle = useCallback(() => {
        let modalTitle;

        if (updateMT5Password) {
            modalTitle = localize('{{title}} latest password requirements', { title });
        } else if (isMT5PasswordNotSet) {
            modalTitle = isVirtual
                ? localize('Create a demo {{title}} password', { title })
                : localize('Create a {{title}} password', { title });
        } else {
            modalTitle = isVirtual
                ? localize('Add an {{title}} {{marketTypeTitle}} demo account', {
                      marketTypeTitle,
                      title: CFD_PLATFORMS.MT5.toLocaleUpperCase(),
                  })
                : localize('Add an {{title}} {{marketTypeTitle}} account', {
                      marketTypeTitle,
                      title: CFD_PLATFORMS.MT5.toLocaleUpperCase(),
                  });
        }

        return modalTitle;
    }, [isMT5PasswordNotSet, isVirtual, localize, marketTypeTitle, title, updateMT5Password]);

    const renderFooter = useCallback(() => {
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
                        <Localize i18n_default_text='Create {{title}} password' values={{ title }} />
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
                        (!validPasswordMT5(password) &&
                            validateMT5ErrorMessage !== getPasswordErrorMessage(localize).missingCharacterMT5) ||
                        !isTncChecked
                    }
                    isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                    onPrimaryClick={onSubmit}
                    onSecondaryClick={() => sendEmailVerification()}
                />
            </div>
        );
    }, [
        isMT5PasswordNotSet,
        password,
        createMT5AccountLoading,
        tradingPlatformPasswordChangeLoading,
        isTncChecked,
        onSubmit,
        isDesktop,
        title,
        validateMT5ErrorMessage,
        localize,
        sendEmailVerification,
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
                    account={account as TAvailableMT5Account}
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
                account={account}
                isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                isTncChecked={isTncChecked}
                isVirtual={isVirtual}
                marketType={marketType}
                modalTitle={
                    isVirtual
                        ? localize('Add an {{title}} {{marketTypeTitle}} demo account', {
                              marketTypeTitle,
                              title: CFD_PLATFORMS.MT5.toLocaleUpperCase(),
                          })
                        : localize('Add an {{title}} {{marketTypeTitle}} account', {
                              marketTypeTitle,
                              title: CFD_PLATFORMS.MT5.toLocaleUpperCase(),
                          })
                }
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
        isLoading,
        isMT5PasswordNotSet,
        platform,
        tradingPlatformPasswordChangeLoading,
        createMT5AccountLoading,
        onSubmit,
        password,
        mt5Platform,
        account,
        isTncChecked,
        isVirtual,
        updateMT5Password,
        tradingPasswordChangeError,
        onSubmitPasswordChange,
        marketType,
        localize,
        marketTypeTitle,
        createMT5AccountError?.error?.code,
        product,
        sendEmailVerification,
    ]);

    if (accountStatusLoading) {
        return <Loader />;
    }

    if (emailVerificationStatus === 'error') {
        return <MT5ErrorModal error={emailVerificationError?.error} onClickHandler={hide} />;
    }

    if (emailVerificationStatus === 'success') {
        return (
            <ModalWrapper isFullscreen={!isDesktop}>
                <SentEmailContent isForgottenPassword platform={CFD_PLATFORMS.MT5} />
            </ModalWrapper>
        );
    }

    if (isPasswordChanged) {
        return (
            <WalletSuccessChangeMT5Password
                onClick={() => {
                    createMT5Account();
                    setIsPasswordChanged(false);
                    setModalOptions(prev => ({ ...prev, shouldCloseOnClickOutside: true }));
                }}
            />
        );
    }

    if (createMT5AccountSuccess) {
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
        return <MT5ErrorModal error={createMT5AccountError?.error} onClickHandler={hide} />;
    }

    if (isDesktop) {
        return <ModalWrapper hideCloseButton={isLoading || createMT5AccountSuccess}>{PasswordComponent}</ModalWrapper>;
    }

    return (
        <ModalStepWrapper renderFooter={!updateMT5Password ? renderFooter : undefined} title={renderTitle()}>
            <div className='wallets-mt5-password-modal__body'>{PasswordComponent}</div>
        </ModalStepWrapper>
    );
};

export default MT5PasswordModal;
