import React, { FC } from 'react';
import { DerivLightMt5SuccessPasswordResetIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { ActionScreen, Button, useDevice } from '@deriv-com/ui';
import { PlatformDetails } from '../../features/cfd/constants';
import { ModalStepWrapper, ModalWrapper } from '../Base';
import './WalletSuccessChangeMT5Password.scss';

type TWalletSuccessChangeMT5Password = {
    onClick: () => void;
};

const WalletSuccessChangeMT5Password: FC<TWalletSuccessChangeMT5Password> = ({ onClick }) => {
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();

    const icon = <DerivLightMt5SuccessPasswordResetIcon data-testid='dt_mt5_success_icon' height={100} width={100} />;
    const title = localize('Success');
    const description = localize('You can log in to all your {{title}} accounts with your new password.', {
        title: PlatformDetails.mt5.title,
    });
    const renderButtons = (
        <Button isFullWidth={!isDesktop} onClick={onClick} size='lg' textSize='sm'>
            {localize('Next')}
        </Button>
    );

    if (isDesktop) {
        return (
            <ModalWrapper hideCloseButton shouldPreventCloseOnEscape>
                <div className='wallets-change-mt5-password'>
                    <ActionScreen
                        actionButtons={renderButtons}
                        description={description}
                        descriptionSize='sm'
                        icon={icon}
                        title={title}
                    />
                </div>
            </ModalWrapper>
        );
    }

    return (
        <ModalStepWrapper
            renderFooter={() => renderButtons}
            shouldHideFooter={isDesktop}
            shouldHideHeader
            shouldPreventCloseOnEscape
        >
            <div className='wallets-change-mt5-password'>
                <ActionScreen description={description} descriptionSize='sm' icon={icon} title={title} />
            </div>
        </ModalStepWrapper>
    );
};

export default WalletSuccessChangeMT5Password;
