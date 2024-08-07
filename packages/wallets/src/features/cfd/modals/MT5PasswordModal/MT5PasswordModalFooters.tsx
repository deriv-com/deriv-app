import React, { ComponentProps } from 'react';
import { WalletButton, WalletButtonGroup } from '../../../../components';
import useDevice from '../../../../hooks/useDevice';

type TProps = {
    disabled: ComponentProps<typeof WalletButton>['disabled'];
    isDemo?: boolean;
    isLoading: ComponentProps<typeof WalletButton>['isLoading'];
    onPrimaryClick: ComponentProps<typeof WalletButton>['onClick'];
    onSecondaryClick: ComponentProps<typeof WalletButton>['onClick'];
};

export const MT5PasswordModalFooter = ({
    disabled,
    isLoading,
    onPrimaryClick,
    onSecondaryClick,
}: Exclude<TProps, 'isDemo'>) => {
    const { isMobile } = useDevice();

    return (
        <WalletButtonGroup isFullWidth>
            <WalletButton isFullWidth onClick={onSecondaryClick} size={isMobile ? 'lg' : 'md'} variant='outlined'>
                Forgot password?
            </WalletButton>
            <WalletButton
                disabled={disabled}
                isFullWidth
                isLoading={isLoading}
                onClick={onPrimaryClick}
                size={isMobile ? 'lg' : 'md'}
            >
                Add account
            </WalletButton>
        </WalletButtonGroup>
    );
};
