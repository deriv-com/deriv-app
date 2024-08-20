import React, { ComponentProps } from 'react';
import { Localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { WalletButton, WalletButtonGroup } from '../../../../components';

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
    const { isDesktop } = useDevice();
    const walletButtonSize = isDesktop ? 'md' : 'lg';

    return (
        <WalletButtonGroup isFullWidth>
            <WalletButton isFullWidth onClick={onSecondaryClick} size={walletButtonSize} variant='outlined'>
                <Localize i18n_default_text='Forgot password?' />
            </WalletButton>
            <WalletButton
                disabled={disabled}
                isFullWidth
                isLoading={isLoading}
                onClick={onPrimaryClick}
                size={walletButtonSize}
            >
                <Localize i18n_default_text='Add account' />
            </WalletButton>
        </WalletButtonGroup>
    );
};
