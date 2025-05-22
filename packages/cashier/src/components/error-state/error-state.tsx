import React from 'react';
import { localize } from '@deriv/translations';
import { EmptyState } from '@deriv/components';

type TProps = {
    error: unknown;
};

const ErrorState: React.FC<TProps> = ({ error }) => {
    let message = localize('Please refresh the page and try again.');

    if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
        message = error.message;
    }

    return (
        <EmptyState
            icon='IcTriangleExclamationXl'
            title={localize('Something went wrong')}
            description={message}
            action={{
                label: localize('Refresh page'),
                onClick: () => window.location.reload(),
                tertiary: true,
            }}
        />
    );
};

export default ErrorState;
