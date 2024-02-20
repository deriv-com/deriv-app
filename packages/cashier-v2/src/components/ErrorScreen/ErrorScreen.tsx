import React from 'react';
import { ActionScreen, Button } from '@deriv-com/ui';
import ErrorIcon from '../../assets/images/error-icon.svg';

type TProps = {
    message?: string;
};

const ErrorState: React.FC<TProps> = ({
    message = 'Sorry an error occurred. Please try accessing our cashier page again.',
}) => {
    return (
        <ActionScreen
            actionButtons={
                <Button onClick={() => window.location.reload()} size='lg' variant='ghost'>
                    Try again
                </Button>
            }
            description={message}
            icon={<ErrorIcon data-testid='dt_error_icon' />}
            title='Oops, something went wrong!'
        />
    );
};

export default ErrorState;
