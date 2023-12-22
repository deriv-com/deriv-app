import React, { FC, useCallback } from 'react';
import useDevice from '../../hooks/useDevice';
import MT5SuccessPasswordReset from '../../public/images/mt5-success-password-reset.svg';
import { ModalStepWrapper, WalletButton } from '../Base';
import { useModal } from '../ModalProvider';
import { WalletsActionScreen } from '../WalletsActionScreen';

type WalletSuccessResetMT5PasswordProps = {
    title: string;
};

const WalletSuccessResetMT5Password: FC<WalletSuccessResetMT5PasswordProps> = ({ title }) => {
    const { hide } = useModal();
    const { isDesktop, isMobile } = useDevice();

    const renderFooter = useCallback(() => {
        return isMobile ? (
            <WalletButton isFullWidth onClick={() => hide()} size='lg'>
                Done
            </WalletButton>
        ) : null;
    }, [isMobile, hide]);

    const renderButtons = useCallback(() => {
        return isDesktop ? (
            <WalletButton onClick={() => hide()} size='lg'>
                Done
            </WalletButton>
        ) : null;
    }, [isDesktop, hide]);

    return (
        <ModalStepWrapper renderFooter={renderFooter} shouldFixedFooter={isDesktop} title={`Manage ${title} password`}>
            <div className='wallets-reset-mt5-password'>
                <WalletsActionScreen
                    description={`You have a new ${title} password to log in to your ${title} accounts on the web and mobile apps.`}
                    descriptionSize='sm'
                    icon={<MT5SuccessPasswordReset />}
                    renderButtons={renderButtons}
                    title='Success'
                />
            </div>
        </ModalStepWrapper>
    );
};

export default WalletSuccessResetMT5Password;
