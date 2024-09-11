import React, { ComponentProps, FC } from 'react';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';
import { ModalStepWrapper, ModalWrapper, WalletButtonGroup } from '../../../../components';
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
    const buttonTextSize = isDesktop ? 'md' : 'sm';

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
                            <Button
                                borderWidth='sm'
                                color='black'
                                isFullWidth
                                isLoading={isForgotPasswordLoading}
                                onClick={onSecondaryClick}
                                size='lg'
                                textSize={buttonTextSize}
                                variant='outlined'
                            >
                                <Localize i18n_default_text='Forgot password?' />
                            </Button>
                            <Button
                                disabled={!password || isLoading}
                                isFullWidth
                                isLoading={isLoading}
                                onClick={onPrimaryClick}
                                size='lg'
                                textSize={buttonTextSize}
                            >
                                <Localize i18n_default_text='Add account' />
                            </Button>
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
        </ModalStepWrapper>
    );
};

export default EnterPasswordModal;
