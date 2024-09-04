import React, { ComponentProps, FC } from 'react';
import { Localize, useTranslations } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { ModalStepWrapper, ModalWrapper, WalletButton, WalletButtonGroup } from '../../../../components';
import { PlatformDetails } from '../../constants';
import { EnterPassword } from '../../screens';
import './EnterPasswordModal.scss';

const EnterPasswordModal: FC<ComponentProps<typeof EnterPassword>> = ({
    isForgotPasswordLoading,
    isLoading,
    marketType,
    onPasswordChange,
    onPrimaryClick,
    onSecondaryClick,
    password,
    passwordError,
    platform,
    setPassword,
}) => {
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();

    const title = localize('Enter your {{platformTitle}} password', { platformTitle: PlatformDetails[platform].title });
    const buttonSize = isDesktop ? 'md' : 'lg';

    if (isDesktop) {
        return (
            <ModalWrapper>
                <div className='wallets-password-modal__body'>
                    <EnterPassword
                        isForgotPasswordLoading={isForgotPasswordLoading}
                        isLoading={isLoading}
                        marketType={marketType}
                        modalTitle={title}
                        onPasswordChange={onPasswordChange}
                        onPrimaryClick={onPrimaryClick}
                        onSecondaryClick={onSecondaryClick}
                        password={password}
                        passwordError={passwordError}
                        platform={platform}
                        setPassword={setPassword}
                    />
                </div>
            </ModalWrapper>
        );
    }

    return (
        <ModalStepWrapper
            renderFooter={() => {
                return (
                    <div className='wallets-password-modal__footer'>
                        <WalletButtonGroup isFullWidth>
                            <WalletButton
                                isFullWidth
                                isLoading={isForgotPasswordLoading}
                                onClick={onSecondaryClick}
                                size={buttonSize}
                                variant='outlined'
                            >
                                <Localize i18n_default_text='Forgot password?' />
                            </WalletButton>
                            <WalletButton
                                disabled={!password || isLoading}
                                isFullWidth
                                isLoading={isLoading}
                                onClick={onPrimaryClick}
                                size={buttonSize}
                            >
                                <Localize i18n_default_text='Add account' />
                            </WalletButton>
                        </WalletButtonGroup>
                    </div>
                );
            }}
            title={title}
        >
            <div className='wallets-password-modal__body'>
                <EnterPassword
                    isForgotPasswordLoading={isForgotPasswordLoading}
                    isLoading={isLoading}
                    marketType={marketType}
                    onPasswordChange={onPasswordChange}
                    onPrimaryClick={onPrimaryClick}
                    onSecondaryClick={onSecondaryClick}
                    password={password}
                    passwordError={passwordError}
                    platform={platform}
                    setPassword={setPassword}
                />
            </div>
        </ModalStepWrapper>
    );
};

export default EnterPasswordModal;
