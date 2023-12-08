import React from 'react';
import IcCashierError from '../../public/images/ic-cashier-error.svg';
import { WalletButton } from '../Base';
import { WalletsActionScreen } from '../WalletsActionScreen';

type TProps = {
    message: string;
};

const ErrorState: React.FC<TProps> = ({
    message = 'Sorry an error occurred. Please try accessing our cashier page again.',
}) => {
    return (
        <WalletsActionScreen
            description={message}
            icon={<IcCashierError />}
            renderButtons={() => (
                <WalletButton onClick={() => window.location.reload()} size='lg' variant='ghost'>
                    Try again
                </WalletButton>
            )}
            title='Oops, something went wrong!'
        />
    );
};

export default ErrorState;
