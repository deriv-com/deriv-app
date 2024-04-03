import React, { ComponentProps } from 'react';
import { useHistory } from 'react-router-dom';
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

    const handleOnClickReal = () => {
        hide();
        history.push('/appstore/traders-hub/cashier/account-transfer');
    };

    if (isDemo) {
        return (
            <div className='wallets-success-btn'>
                <WalletButton isFullWidth onClick={hide} size='lg'>
                    OK
                </WalletButton>
            </div>
        );
    }

    return (
        <WalletButtonGroup isFlex isFullWidth>
            <WalletButton onClick={hide} size='lg' variant='outlined'>
                Maybe later
            </WalletButton>
            <WalletButton onClick={() => handleOnClickReal()} size='lg'>
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
    return (
        <WalletButtonGroup isFullWidth>
            <WalletButton isFullWidth onClick={onSecondaryClick} size='lg' variant='outlined'>
                Forgot password?
            </WalletButton>
            <WalletButton disabled={disabled} isFullWidth isLoading={isLoading} onClick={onPrimaryClick} size='lg'>
                Add account
            </WalletButton>
        </WalletButtonGroup>
    );
};
