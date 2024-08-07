import React, { ComponentProps } from 'react';
import { Button } from '@deriv-com/ui';
import { WalletsActionScreen } from '../WalletsActionScreen';
import './WalletsErrorScreen.scss';

type TProps = {
    buttonText?: string;
    buttonVariant?: ComponentProps<typeof Button>['variant'];
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
