import React, { FC, useCallback } from 'react';
import { DerivLightIcMt5PasswordUpdatedIcon, DerivLightMt5SuccessPasswordResetIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import useDevice from '../../hooks/useDevice';
import { ModalStepWrapper, WalletButton } from '../Base';
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
    const { isMobile } = useDevice();
    const { localize } = useTranslations();

    const renderButtons = useCallback(() => {
        return (
            <WalletButton isFullWidth={isMobile} onClick={onClick} size='lg'>
                {isInvestorPassword ? localize('Ok') : localize('Done')}
            </WalletButton>
        );
    }, [isInvestorPassword, isMobile, localize, onClick]);

    return (
        <ModalStepWrapper
            renderFooter={isMobile ? renderButtons : undefined}
            shouldHideFooter={!isMobile}
            title={
                isInvestorPassword
                    ? localize('Reset {{title}} password', { title })
                    : localize('Manage {{title}} password', { title })
            }
        >
            <div className='wallets-reset-mt5-password'>
                <WalletsActionScreen
                    description={
                        isInvestorPassword
                            ? localize('Your investor password has been changed.')
                            : localize(
                                  'You have a new {{title}} password to log in to your {{title}} accounts on the web and mobile apps.',
                                  { title }
                              )
                    }
                    descriptionSize='sm'
                    icon={
                        isInvestorPassword ? (
                            <DerivLightIcMt5PasswordUpdatedIcon height={100} width={100} />
                        ) : (
                            <DerivLightMt5SuccessPasswordResetIcon height={100} width={100} />
                        )
                    }
                    renderButtons={isMobile ? undefined : renderButtons}
                    title={isInvestorPassword ? localize('Password saved') : localize('Success')}
                />
            </div>
        </ModalStepWrapper>
    );
};

export default WalletSuccessResetMT5Password;
