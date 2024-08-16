import React from 'react';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { ModalStepWrapper, ModalWrapper, WalletButtonGroup } from '../../../../components/Base';
import './PasswordLimitExceededModal.scss';

type TProps = {
    onPrimaryClick: () => void;
    onSecondaryClick: () => void;
};

const PasswordLimitExceededModal: React.FC<TProps> = ({ onPrimaryClick, onSecondaryClick }) => {
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();
    const textSize = isDesktop ? 'sm' : 'md';
    const alignment = isDesktop ? 'start' : 'center';

    if (isDesktop) {
        return (
            <ModalWrapper hideCloseButton>
                <div className='wallets-password-limit-exceeded-modal'>
                    <div className='wallets-password-limit-exceeded-modal__title'>
                        <Text align='start' weight='bold'>
                            <Localize i18n_default_text='Too many attempts' />
                        </Text>
                    </div>
                    <div className='wallets-password-limit-exceeded-modal__content'>
                        <Text align={alignment} size={textSize}>
                            <Localize i18n_default_text='Please try again in a minute.' />
                        </Text>
                    </div>
                    <div className='wallets-password-limit-exceeded-modal__buttons'>
                        <Button
                            borderWidth='md'
                            onClick={onSecondaryClick}
                            size='lg'
                            textSize={textSize}
                            variant='outlined'
                        >
                            <Localize i18n_default_text='Forgot password?' />
                        </Button>
                        <Button onClick={onPrimaryClick} size='lg' textSize={textSize}>
                            <Localize i18n_default_text='Try later' />
                        </Button>
                    </div>
                </div>
            </ModalWrapper>
        );
    }

    return (
        <ModalStepWrapper
            renderFooter={() => {
                return (
                    <WalletButtonGroup isFullWidth>
                        <Button isFullWidth onClick={onSecondaryClick} size='lg' textSize='md' variant='outlined'>
                            <Localize i18n_default_text='Forgot password?' />
                        </Button>
                        <Button isFullWidth onClick={onPrimaryClick} size='lg' textSize='md'>
                            <Localize i18n_default_text='Try later' />
                        </Button>
                    </WalletButtonGroup>
                );
            }}
            title={localize('Too many attempts')}
        >
            <div className='wallets-password-limit-exceeded-modal'>
                <div className='wallets-password-limit-exceeded-modal__content'>
                    <Text align={alignment} size={textSize}>
                        <Localize i18n_default_text='Please try again in a minute.' />
                    </Text>
                </div>
            </div>
        </ModalStepWrapper>
    );
};

export default PasswordLimitExceededModal;
