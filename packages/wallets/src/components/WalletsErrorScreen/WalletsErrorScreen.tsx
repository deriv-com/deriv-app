import React, { ComponentProps } from 'react';
import { WalletButton } from '../Base';
import { WalletsActionScreen } from '../WalletsActionScreen';
import './WalletsErrorScreen.scss';

type TProps = {
    buttonText?: string;
    buttonVariant?: ComponentProps<typeof WalletButton>['variant'];
    message?: string;
    onClick?: () => void;
    title?: string;
};

const WalletsErrorScreen: React.FC<TProps> = ({
    buttonText,
    buttonVariant = 'contained',
    message = 'Sorry an error occurred. Please try accessing our cashier again.',
    onClick,
    title = 'Oops, something went wrong!',
}) => {
    return (
        <div className='wallets-error-screen'>
            <WalletsActionScreen
                description={message}
                renderButtons={() =>
                    buttonText ? (
                        <WalletButton onClick={onClick} size='lg' variant={buttonVariant}>
                            {buttonText}
                        </WalletButton>
                    ) : null
                }
                title={title}
            />
        </div>
    );
};

export default WalletsErrorScreen;
