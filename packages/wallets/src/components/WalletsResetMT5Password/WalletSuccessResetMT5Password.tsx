import React, { FC } from 'react';
import { DerivLightIcMt5PasswordUpdatedIcon, DerivLightMt5SuccessPasswordResetIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { ActionScreen, Button, useDevice } from '@deriv-com/ui';
import { ModalStepWrapper } from '../Base';

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
    const { localize } = useTranslations();

    const renderButtons = (
        <Button isFullWidth={!isDesktop} onClick={onClick} size='lg' textSize='sm'>
            {localize('OK')}
        </Button>
    );

    return (
        <ModalStepWrapper
            renderFooter={isDesktop ? undefined : () => renderButtons}
            shouldHideFooter={isDesktop}
            title={isInvestorPassword ? localize('Reset {{title}} password', { title }) : localize('Success')}
        >
            <div className='wallets-reset-mt5-password'>
                <ActionScreen
                    actionButtons={isDesktop ? renderButtons : undefined}
                    description={
                        isInvestorPassword
                            ? localize('Your investor password has been changed.')
                            : localize('You can log in to all your {{title}} accounts with your new password.', {
                                  title,
                              })
                    }
                    descriptionSize='sm'
                    icon={
                        isInvestorPassword ? (
                            <DerivLightIcMt5PasswordUpdatedIcon height={100} width={100} />
                        ) : (
                            <DerivLightMt5SuccessPasswordResetIcon height={100} width={100} />
                        )
                    }
                    title={isInvestorPassword ? localize('Password saved') : undefined}
                />
            </div>
        </ModalStepWrapper>
    );
};

export default WalletSuccessResetMT5Password;
