import React, { ComponentProps } from 'react';
import ErrorIcon from '../../public/images/error-icon.svg';
import WalletButton from '../Base/WalletButton/WalletButton';
import WalletsActionScreen from '../WalletsActionScreen/WalletsActionScreen';

type TProps = {
    buttonText?: string;
    buttonVariant?: ComponentProps<typeof WalletButton>['variant'];
    errorMessage: string;
    onClick?: () => void;
    title?: string;
    type?: 'modal' | 'page';
};

const WalletError: React.FC<TProps> = ({
    buttonText = 'Try again',
    buttonVariant = 'contained',
    errorMessage,
    onClick,
    title,
    type = 'page',
}) => {
    return (
        <WalletsActionScreen
            actionText={buttonText}
            actionVariant={buttonVariant}
            description={errorMessage}
            icon={<ErrorIcon />}
            onAction={onClick}
            title={title}
            type={type}
        />
    );
};

export default WalletError;
