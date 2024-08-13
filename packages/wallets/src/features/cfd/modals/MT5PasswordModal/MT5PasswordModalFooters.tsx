import React, { ComponentProps } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@deriv-com/ui';
import { WalletButtonGroup } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';

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
                <Button isFullWidth onClick={hide} size={isDesktop ? 'md' : 'lg'}>
                    OK
                </Button>
            </div>
        );
    }

    return (
        <WalletButtonGroup isFlex isFullWidth>
            <Button color='black' onClick={hide} size={isDesktop ? 'md' : 'lg'} variant='outlined'>
                Maybe later
            </Button>
            <Button onClick={() => handleOnClickReal()} size={isDesktop ? 'md' : 'lg'}>
                Transfer funds
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

    return (
        <WalletButtonGroup isFullWidth>
            <Button
                color='black'
                isFullWidth
                onClick={onSecondaryClick}
                size={isDesktop ? 'md' : 'lg'}
                variant='outlined'
            >
                Forgot password?
            </Button>
            <Button
                disabled={disabled}
                isFullWidth
                isLoading={isLoading}
                onClick={onPrimaryClick}
                size={isDesktop ? 'md' : 'lg'}
            >
                Add account
            </Button>
        </WalletButtonGroup>
    );
};
