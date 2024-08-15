import React from 'react';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { ModalStepWrapper, ModalWrapper, WalletButton, WalletButtonGroup } from '../../../../components/Base';
import useDevice from '../../../../hooks/useDevice';
import './PasswordLimitExceededModal.scss';

type TProps = {
    onPrimaryClick: () => void;
    onSecondaryClick: () => void;
};

const PasswordLimitExceededModal: React.FC<TProps> = ({ onPrimaryClick, onSecondaryClick }) => {
    const { isMobile } = useDevice();
    const { localize } = useTranslations();

    const textSize = isMobile ? 'md' : 'sm';
    const alignment = isMobile ? 'center' : 'start';
    if (isMobile) {
        return (
            <ModalStepWrapper
                renderFooter={() => {
                    return (
                        <WalletButtonGroup isFullWidth>
                            <WalletButton
                                borderWidth='md'
                                isFullWidth
                                onClick={onSecondaryClick}
                                size='lg'
                                textSize='md'
                                variant='outlined'
                            >
                                <Localize i18n_default_text='Forgot password?' />
                            </WalletButton>
                            <WalletButton isFullWidth onClick={onPrimaryClick} size='lg' textSize='md'>
                                <Localize i18n_default_text='Try later' />
                            </WalletButton>
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
    }
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
                    <WalletButton
                        borderWidth='md'
                        onClick={onSecondaryClick}
                        size='lg'
                        textSize={textSize}
                        variant='outlined'
                    >
                        <Localize i18n_default_text='Forgot password?' />
                    </WalletButton>
                    <WalletButton onClick={onPrimaryClick} size='lg' textSize={textSize}>
                        <Localize i18n_default_text='Try later' />
                    </WalletButton>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default PasswordLimitExceededModal;
