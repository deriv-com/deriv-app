import React, { ComponentProps, FC } from 'react';
import { Button } from '@deriv-com/ui';
import { ModalStepWrapper, ModalWrapper, WalletButtonGroup } from '../../../../components';
import useDevice from '../../../../hooks/useDevice';
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

    const title = `Enter your ${PlatformDetails[platform].title} password`;

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
                        <Button
                            color='black'
                            isFullWidth
                            isLoading={isForgotPasswordLoading}
                            onClick={onSecondaryClick}
                            size='lg'
                            variant='outlined'
                        >
                            Forgot password?
                        </Button>
                        <Button
                            disabled={!password || isLoading}
                            isFullWidth
                            isLoading={isLoading}
                            onClick={onPrimaryClick}
                            size='lg'
                        >
                            Add account
                        </Button>
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
