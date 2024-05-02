import React from 'react';
import { LegacyWarningIcon } from '@deriv/quill-icons';
import { WalletButton } from '../Base';
import { WalletsActionScreen } from '../WalletsActionScreen';

type TProps = {
    message?: string;
};

const ErrorState: React.FC<TProps> = ({
    message = 'Sorry an error occurred. Please try accessing our cashier page again.',
}) => {
    return (
        <WalletsActionScreen
            description={message}
            icon={<LegacyWarningIcon data-testid='dt_error_icon' fill='#FF444F' iconSize='2xl' />}
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
