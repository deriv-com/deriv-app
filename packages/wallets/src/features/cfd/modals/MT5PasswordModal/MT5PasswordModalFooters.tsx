import React, { ComponentProps } from 'react';
import { useHistory } from 'react-router-dom';
import { Localize } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';
import { WalletButtonGroup } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';

type TProps = {
    disabled: ComponentProps<typeof Button>['disabled'];
    isDemo?: boolean;
    isLoading: ComponentProps<typeof Button>['isLoading'];
    onPrimaryClick: ComponentProps<typeof Button>['onClick'];
    onSecondaryClick: ComponentProps<typeof Button>['onClick'];
};

export const SuccessModalFooter = ({ isDemo }: Pick<TProps, 'isDemo'>) => {
    const history = useHistory();
    const { hide } = useModal();
    const { isDesktop } = useDevice();

    const handleOnClickReal = () => {
        hide();
        history.push('/wallet/account-transfer');
    };

    if (isDemo) {
        return (
            <div className='wallets-success-btn'>
                <Button isFullWidth onClick={hide} size={isDesktop ? 'md' : 'lg'} textSize='sm'>
                    <Localize i18n_default_text='OK' />
                </Button>
            </div>
        );
    }

    return (
        <WalletButtonGroup isFlex isFullWidth>
            <Button
                borderWidth='sm'
                color='black'
                onClick={hide}
                size={isDesktop ? 'md' : 'lg'}
                textSize='sm'
                variant='outlined'
            >
                <Localize i18n_default_text='Maybe later' />
            </Button>
            <Button onClick={handleOnClickReal} size={isDesktop ? 'md' : 'lg'} textSize='sm'>
                <Localize i18n_default_text='Transfer funds' />
            </Button>
        </WalletButtonGroup>
    );
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
            <Button
                borderWidth='sm'
                color='black'
                isFullWidth
                onClick={onSecondaryClick}
                size={walletButtonSize}
                textSize='sm'
                variant='outlined'
            >
                <Localize i18n_default_text='Forgot password?' />
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
