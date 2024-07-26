import React, { ComponentProps } from 'react';
import { WalletButton } from '../Base';
import { WalletsActionScreen } from '../WalletsActionScreen';
import './WalletsErrorScreen.scss';

type TProps = {
    buttonText?: React.ReactNode;
    buttonVariant?: ComponentProps<typeof WalletButton>['variant'];
    message: React.ReactNode;
    onClick?: () => void;
    title: React.ReactNode;
};

const WalletsErrorScreen: React.FC<TProps> = ({ buttonText, buttonVariant = 'contained', message, onClick, title }) => {
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
