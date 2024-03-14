import React, { FC, useCallback } from 'react';
import { Trans } from 'react-i18next';
import useDevice from '../../hooks/useDevice';
import MT5PasswordUpdatedIcon from '../../public/images/ic-mt5-password-updated.svg';
import MT5SuccessPasswordReset from '../../public/images/mt5-success-password-reset.svg';
import { ModalStepWrapper, WalletButton } from '../Base';
import { useModal } from '../ModalProvider';
import { WalletsActionScreen } from '../WalletsActionScreen';

type WalletSuccessResetMT5PasswordProps = {
    isInvestorPassword?: boolean;
    title: string;
};

const WalletSuccessResetMT5Password: FC<WalletSuccessResetMT5PasswordProps> = ({
    isInvestorPassword = false,
    title,
}) => {
    const { hide } = useModal();
    const { isDesktop, isMobile } = useDevice();

    const renderFooter = useCallback(() => {
        return isMobile ? (
            <WalletButton isFullWidth onClick={() => hide()} size='lg'>
                <Trans defaults='Done' />
            </WalletButton>
        ) : null;
    }, [isMobile, hide]);

    const renderButtons = useCallback(() => {
        return isDesktop ? (
            <WalletButton onClick={() => hide()} size='lg'>
                <Trans defaults='Done' />
            </WalletButton>
        ) : null;
    }, [isDesktop, hide]);

    return (
        <ModalStepWrapper
            renderFooter={isMobile ? renderFooter : undefined}
            shouldFixedFooter={isMobile}
            title={`Manage ${title} password`}
        >
            <div className='wallets-reset-mt5-password'>
                <WalletsActionScreen
                    description={
                        isInvestorPassword
                            ? 'Your investor password has been changed.'
                            : `You have a new ${title} password to log in to your ${title} accounts on the web and mobile apps.`
                    }
                    descriptionSize='sm'
                    icon={isInvestorPassword ? <MT5PasswordUpdatedIcon /> : <MT5SuccessPasswordReset />}
                    renderButtons={renderButtons}
                    title={isInvestorPassword ? 'Password saved' : 'Success'}
                />
            </div>
        </ModalStepWrapper>
    );
};

export default WalletSuccessResetMT5Password;
