import React from 'react';
import { localize } from '@deriv/translations';
import { EmptyState } from '@deriv/components';

type TProps = {
    error: unknown;
};

const ErrorState: React.FC<TProps> = ({ error }) => {
    let message = localize('Something went wrong. Please refresh the page and try again.');

    if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
        message = error.message;
    }

    return (
        <EmptyState
            icon='IcCashierError'
            title={localize('Oops, something went wrong!')}
            description={message}
            action={{
                label: localize('Try again'),
                onClick: () => window.location.reload(),
                tertiary: true,
            }}
        />
    );
};

export default ErrorState;
