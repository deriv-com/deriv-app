import React, { ComponentProps } from 'react';
import { Localize } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';
import { WalletButtonGroup } from '../../../../components';

type TProps = {
    disabled: ComponentProps<typeof Button>['disabled'];
    isLoading: ComponentProps<typeof Button>['isLoading'];
    onPrimaryClick: ComponentProps<typeof Button>['onClick'];
    onSecondaryClick: ComponentProps<typeof Button>['onClick'];
};

export const MT5PasswordModalFooter = ({ disabled, isLoading, onPrimaryClick, onSecondaryClick }: TProps) => {
    const { isDesktop } = useDevice();
    const walletButtonSize = isDesktop ? 'md' : 'lg';

    return (
        <WalletButtonGroup isFullWidth>
            <Button
                borderWidth='sm'
                color='black'
                isFullWidth
                onClick={onSecondaryClick}
                size={walletButtonSize}
                textSize='sm'
                variant='outlined'
            >
                <Localize i18n_default_text='Forgot password' />
            </Button>
            <Button
                disabled={disabled}
                isFullWidth
                isLoading={isLoading}
                onClick={onPrimaryClick}
                size={walletButtonSize}
                textSize='sm'
            >
                <Localize i18n_default_text='Add account' />
            </Button>
        </WalletButtonGroup>
    );
};
