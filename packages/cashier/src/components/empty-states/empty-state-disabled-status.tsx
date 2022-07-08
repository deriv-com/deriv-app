import { localize } from '@deriv/translations';
import React from 'react';
import EmptyState from '../empty-state';

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
