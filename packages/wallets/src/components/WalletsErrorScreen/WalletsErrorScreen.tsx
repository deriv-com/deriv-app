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
            action={{
                actionText: 'Try again',
                onAction: () => window.location.reload(),
                variant: 'ghost',
            }}
            description={message}
            icon={<IcCashierError />}
            title='Oops, something went wrong!'
        />
    );
};

export default ErrorState;
