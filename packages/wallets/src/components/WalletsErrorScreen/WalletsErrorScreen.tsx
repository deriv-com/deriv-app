import React from 'react';
import IcCashierError from '../../public/images/ic-cashier-error.svg';
import WalletsActionScreen from '../WalletsActionScreen/WalletsActionScreen';

type TProps = {
    message: string;
};

const ErrorState: React.FC<TProps> = ({
    message = 'Sorry an error occurred. Please try accessing our cashier page again.',
}) => {
    return (
        <WalletsActionScreen
            actionText='Try again'
            description={message}
            icon={<IcCashierError />}
            onAction={() => window.location.reload()}
            title='Oops, something went wrong!'
            variant='ghost'
        />
    );
};

export default ErrorState;
