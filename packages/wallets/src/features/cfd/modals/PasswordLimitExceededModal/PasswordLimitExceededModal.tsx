import React from 'react';
import { Button } from '@deriv-com/ui';
import { ModalStepWrapper, ModalWrapper, WalletButtonGroup, WalletText } from '../../../../components/Base';
import useDevice from '../../../../hooks/useDevice';
import './PasswordLimitExceededModal.scss';

type TProps = {
    onPrimaryClick: () => void;
    onSecondaryClick: () => void;
};

const PasswordLimitExceededModal: React.FC<TProps> = ({ onPrimaryClick, onSecondaryClick }) => {
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'md' : 'sm';
    const alignment = isMobile ? 'center' : 'start';
    if (isMobile) {
        return (
            <ModalStepWrapper
                renderFooter={() => {
                    return (
                        <WalletButtonGroup isFullWidth>
                            <Button isFullWidth onClick={onSecondaryClick} size='lg' textSize='md' variant='outlined'>
                                Forgot password?
                            </Button>
                            <Button isFullWidth onClick={onPrimaryClick} size='lg' textSize='md'>
                                Try later
                            </Button>
                        </WalletButtonGroup>
                    );
                }}
                title='Too many attempts'
            >
                <div className='wallets-password-limit-exceeded-modal'>
                    <div className='wallets-password-limit-exceeded-modal__content'>
                        <WalletText align={alignment} size={textSize}>
                            Please try again in a minute.
                        </WalletText>
                    </div>
                </div>
            </ModalStepWrapper>
        );
    }
    return (
        <ModalWrapper hideCloseButton>
            <div className='wallets-password-limit-exceeded-modal'>
                <div className='wallets-password-limit-exceeded-modal__title'>
                    <WalletText align='start' weight='bold'>
                        Too many attempts
                    </WalletText>
                </div>
                <div className='wallets-password-limit-exceeded-modal__content'>
                    <WalletText align={alignment} size={textSize}>
                        Please try again in a minute.
                    </WalletText>
                </div>
                <div className='wallets-password-limit-exceeded-modal__buttons'>
                    <Button
                        borderWidth='md'
                        onClick={onSecondaryClick}
                        size='lg'
                        textSize={textSize}
                        variant='outlined'
                    >
                        Forgot password?
                    </Button>
                    <Button onClick={onPrimaryClick} size='lg' textSize={textSize}>
                        Try later
                    </Button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default PasswordLimitExceededModal;
