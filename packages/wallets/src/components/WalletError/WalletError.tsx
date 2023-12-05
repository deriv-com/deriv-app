import React, { ComponentProps } from 'react';
import useDevice from '../../hooks/useDevice';
import ErrorIcon from '../../public/images/error-icon.svg';
import { ModalStepWrapper } from '../Base';
import WalletButton from '../Base/WalletButton/WalletButton';
import { WalletsActionScreen } from '../WalletsActionScreen';
import './WalletError.scss';

type TProps = {
    buttonText?: string;
    buttonVariant?: ComponentProps<typeof WalletButton>['variant'];
    errorMessage: string;
    onClick?: () => void;
    title?: string;
};

const WalletError: React.FC<TProps> = ({
    buttonText = 'Try again',
    buttonVariant = 'contained',
    errorMessage,
    onClick,
    title,
}) => {
    const { isDesktop, isMobile } = useDevice();

    return (
        <ModalStepWrapper shouldHideHeader={isDesktop}>
            <div className='wallets-error'>
                <WalletsActionScreen
                    description={errorMessage}
                    icon={<ErrorIcon />}
                    renderButtons={() => (
                        <WalletButton isFullWidth={isMobile} onClick={onClick} size='lg' variant={buttonVariant}>
                            {buttonText}
                        </WalletButton>
                    )}
                    title={title}
                />
            </div>
        </ModalStepWrapper>
    );
};

export default WalletError;
