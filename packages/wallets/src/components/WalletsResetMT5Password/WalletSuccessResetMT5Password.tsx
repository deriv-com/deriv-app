import React, { FC, useCallback } from 'react';
import { DerivLightIcMt5PasswordUpdatedIcon, DerivLightMt5SuccessPasswordResetIcon } from '@deriv/quill-icons';
import { Button } from '@deriv-com/ui';
import useDevice from '../../hooks/useDevice';
import { ModalStepWrapper } from '../Base';
import { WalletsActionScreen } from '../WalletsActionScreen';

type WalletSuccessResetMT5PasswordProps = {
    isInvestorPassword?: boolean;
    onClick: () => void;
    title: string;
};

const WalletSuccessResetMT5Password: FC<WalletSuccessResetMT5PasswordProps> = ({
    isInvestorPassword = false,
    onClick,
    title,
}) => {
    const { isDesktop } = useDevice();

    const renderButtons = useCallback(() => {
        return (
            <Button isFullWidth={!isDesktop} onClick={onClick} size='lg' textSize={isDesktop ? 'sm' : 'md'}>
                {isInvestorPassword ? 'Ok' : 'Done'}
            </Button>
        );
    }, [isInvestorPassword, isDesktop, onClick]);

    return (
        <ModalStepWrapper
            renderFooter={isDesktop ? undefined : renderButtons}
            shouldHideFooter={isDesktop}
            title={isInvestorPassword ? `Reset ${title} password` : `Manage ${title} password`}
        >
            <div className='wallets-reset-mt5-password'>
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
                    renderButtons={isDesktop ? renderButtons : undefined}
                    title={isInvestorPassword ? 'Password saved' : 'Success'}
                />
            </div>
        </ModalStepWrapper>
    );
};

export default WalletSuccessResetMT5Password;
