import React, { ComponentProps } from 'react';
import { ActionScreen, Button } from '@deriv-com/ui';
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
            <ActionScreen
                actionButtons={
                    buttonText ? (
                        <Button borderWidth='sm' onClick={onClick} size='lg' textSize='md' variant={buttonVariant}>
                            {buttonText}
                        </Button>
                    ) : undefined
                }
                description={message}
                title={title}
            />
        </div>
    );
};

export default WalletsErrorScreen;
