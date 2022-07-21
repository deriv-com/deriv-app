import React from 'react';
import { localize } from '@deriv/translations';
import EmptyState from 'Components/empty-state';

const EmptyStateDisabledStatus: React.FC = () => (
    <EmptyState
        icon={'IcCashierLocked'}
        title={localize('Cashier is locked')}
        description={localize(
            'Your account is temporarily disabled. Please contact us via live chat to enable deposits and withdrawals again.'
        )}
    />
);

export default EmptyStateDisabledStatus;
