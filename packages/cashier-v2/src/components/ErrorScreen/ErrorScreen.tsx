import React from 'react';
import { Button } from '@deriv-com/ui';
import ErrorIcon from '../../assets/images/error-icon.svg';
import { ActionScreen } from '../ActionScreen';

type TProps = {
    message?: string;
};

const ErrorState: React.FC<TProps> = ({
    message = 'Sorry an error occurred. Please try accessing our cashier page again.',
}) => {
    return (
        <ActionScreen
            description={message}
            icon={<ErrorIcon data-testid='dt_error_icon' />}
            renderButtons={() => (
                <Button onClick={() => window.location.reload()} size='lg' variant='ghost'>
                    Try again
                </Button>
            )}
            title='Oops, something went wrong!'
        />
    );
};

export default ErrorState;
