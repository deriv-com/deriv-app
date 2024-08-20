import React, { ComponentProps } from 'react';
import { Localize } from '@deriv-com/translations';
import { Button } from '@deriv-com/ui';
import { WalletButtonGroup } from '../../../../components';
import useDevice from '../../../../hooks/useDevice';

type TProps = {
    disabled: ComponentProps<typeof Button>['disabled'];
    isDemo?: boolean;
    isLoading: ComponentProps<typeof Button>['isLoading'];
    onPrimaryClick: ComponentProps<typeof Button>['onClick'];
    onSecondaryClick: ComponentProps<typeof Button>['onClick'];
};

export const MT5PasswordModalFooter = ({
    disabled,
    isLoading,
    onPrimaryClick,
    onSecondaryClick,
}: Exclude<TProps, 'isDemo'>) => {
    const { isDesktop } = useDevice();

    return (
        <WalletButtonGroup isFullWidth>
            <Button
                color='black'
                isFullWidth
                onClick={onSecondaryClick}
                size={isDesktop ? 'md' : 'lg'}
                variant='outlined'
            >
                <Localize i18n_default_text='Forgot password?' />
            </Button>
            <Button
                disabled={disabled}
                isFullWidth
                isLoading={isLoading}
                onClick={onPrimaryClick}
                size={isDesktop ? 'md' : 'lg'}
            >
                <Localize i18n_default_text='Add account' />
            </Button>
        </WalletButtonGroup>
    );
};
