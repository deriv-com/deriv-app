import React, { ComponentProps, FC } from 'react';
import { Localize, useTranslations } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { ModalStepWrapper, ModalWrapper, WalletButton, WalletButtonGroup } from '../../../../components';
import { PlatformDetails } from '../../constants';
import { EnterPassword } from '../../screens';

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
            </ModalWrapper>
        );
    }

    return (
        <ModalStepWrapper
            renderFooter={() => {
                return (
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
                );
            }}
            title={title}
        >
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
        </ModalStepWrapper>
    );
};

export default EnterPasswordModal;
