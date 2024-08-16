import React, { ComponentProps } from 'react';
import { Button } from '@deriv-com/ui';
import { WalletsActionScreen } from '../WalletsActionScreen';
import './WalletsErrorScreen.scss';

type TProps = {
    buttonText?: React.ReactNode;
    buttonVariant?: ComponentProps<typeof Button>['variant'];
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
                        <Button borderWidth='sm' onClick={onClick} size='lg' textSize='md' variant={buttonVariant}>
                            {buttonText}
                        </Button>
                    ) : null
                }
                title={title}
            />
        </div>
    );
};

export default WalletsErrorScreen;
