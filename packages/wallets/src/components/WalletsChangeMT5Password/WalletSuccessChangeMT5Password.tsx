import React, { FC } from 'react';
import { DerivLightMt5SuccessPasswordResetIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { ActionScreen, Button, useDevice } from '@deriv-com/ui';
import { PlatformDetails } from '../../features/cfd/constants';
import { ModalStepWrapper, ModalWrapper } from '../Base';
import './WalletsChangeMT5Password.scss';

type TWalletSuccessChangeMT5Password = {
    onClick: () => void;
};

const WalletSuccessChangeMT5Password: FC<TWalletSuccessChangeMT5Password> = ({ onClick }) => {
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();

    const title = localize('Success');
    const description = localize(
        'You have a new {{title}} password to log in to your {{title}} accounts on the web and mobile apps.',
        { title: PlatformDetails.mt5.title }
    );
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
                        icon={<DerivLightMt5SuccessPasswordResetIcon height={100} width={100} />}
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
                <ActionScreen
                    description={description}
                    descriptionSize='sm'
                    icon={<DerivLightMt5SuccessPasswordResetIcon height={100} width={100} />}
                    title={title}
                />
            </div>
        </ModalStepWrapper>
    );
};

export default WalletSuccessChangeMT5Password;
