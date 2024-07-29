import React, { ComponentProps } from 'react';
import { useHistory } from 'react-router-dom';
import { useDevice } from '@deriv-com/ui';
import { WalletButton, WalletButtonGroup } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';

type TProps = {
    disabled: ComponentProps<typeof WalletButton>['disabled'];
    isDemo?: boolean;
    isLoading: ComponentProps<typeof WalletButton>['isLoading'];
    onPrimaryClick: ComponentProps<typeof WalletButton>['onClick'];
    onSecondaryClick: ComponentProps<typeof WalletButton>['onClick'];
};

export const SuccessModalFooter = ({ isDemo }: Pick<TProps, 'isDemo'>) => {
    const history = useHistory();
    const { hide } = useModal();
    const { isDesktop } = useDevice();

    const handleOnClickReal = () => {
        hide();
        history.push('/wallet/account-transfer');
    };

    const walletButtonSize = isDesktop ? 'md' : 'lg';

    if (isDemo) {
        return (
            <div className='wallets-success-btn'>
                <WalletButton isFullWidth onClick={hide} size={walletButtonSize}>
                    OK
                </WalletButton>
            </div>
        );
    }

    return (
        <WalletButtonGroup isFlex isFullWidth>
            <WalletButton onClick={hide} size={walletButtonSize} variant='outlined'>
                Maybe later
            </WalletButton>
            <WalletButton onClick={() => handleOnClickReal()} size={walletButtonSize}>
                Transfer funds
            </WalletButton>
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
            <WalletButton isFullWidth onClick={onSecondaryClick} size={walletButtonSize} variant='outlined'>
                Forgot password?
            </WalletButton>
            <WalletButton
                disabled={disabled}
                isFullWidth
                isLoading={isLoading}
                onClick={onPrimaryClick}
                size={walletButtonSize}
            >
                Add account
            </WalletButton>
        </WalletButtonGroup>
    );
};
