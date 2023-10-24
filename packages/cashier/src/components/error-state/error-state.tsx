import React from 'react';
import { localize } from '@deriv/translations';
import { EmptyState } from '@deriv/components';
import FundsProtection from '../funds-protection';

type TProps = {
    error: unknown;
};

const ErrorState: React.FC<TProps> = ({ error }) => {
    let code = localize('UNKNOWN');
    let message = localize('Something went wrong. Please refresh the page and try again.');

    if (error && typeof error === 'object' && 'code' in error && typeof error.code === 'string') {
        code = error.code;
    }

    if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
        message = error.message;
    }

    if (code === 'ASK_UK_FUNDS_PROTECTION') return <FundsProtection />;

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
