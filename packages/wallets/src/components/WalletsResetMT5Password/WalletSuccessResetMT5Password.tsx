import React, { FC, useCallback } from 'react';
import { Trans } from 'react-i18next';
import { DerivLightIcMt5PasswordUpdatedIcon, DerivLightMt5SuccessPasswordResetIcon } from '@deriv/quill-icons';
import { PlatformDetails } from '../../features/cfd/constants';
import useDevice from '../../hooks/useDevice';
import { ModalWrapper, WalletButton, WalletText } from '../Base';
import { useModal } from '../ModalProvider';
import { WalletsActionScreen } from '../WalletsActionScreen';

type WalletSuccessResetMT5PasswordProps = {
    isInvestorPassword?: boolean;
    onClickSuccess?: () => void;
    title: string;
};

const WalletSuccessResetMT5Password: FC<WalletSuccessResetMT5PasswordProps> = ({
    isInvestorPassword = false,
    onClickSuccess,
    title,
}) => {
    const { hide } = useModal();
    const { isMobile } = useDevice();

    const handleSuccess = useCallback(() => {
        onClickSuccess?.();
        hide();
    }, [onClickSuccess, hide]);

    const renderButtons = useCallback(() => {
        return (
            <WalletButton onClick={handleSuccess} size='lg'>
                {isInvestorPassword ? <Trans defaults='Ok' /> : <Trans defaults='Done' />}
            </WalletButton>
        );
    }, [handleSuccess, isInvestorPassword]);

    return (
        <ModalWrapper hideCloseButton={isMobile || !isInvestorPassword}>
            <div className='wallets-reset-mt5-password'>
                {isInvestorPassword && (
                    <WalletText size='md' weight='bold'>
                        Reset {PlatformDetails.mt5.title} investor password
                    </WalletText>
                )}
                <WalletsActionScreen
                    description={
                        isInvestorPassword
                            ? 'Your investor password has been changed.'
                            : `You have a new ${title} password to log in to your ${title} accounts on the web and mobile apps.`
                    }
                    descriptionSize='sm'
                    icon={
                        isInvestorPassword ? (
                            <DerivLightIcMt5PasswordUpdatedIcon height={100} width={100} />
                        ) : (
                            <DerivLightMt5SuccessPasswordResetIcon height={100} width={100} />
                        )
                    }
                    renderButtons={renderButtons}
                    title={isInvestorPassword ? 'Password saved' : 'Success'}
                />
            </div>
        </ModalWrapper>
    );
};

export default WalletSuccessResetMT5Password;
