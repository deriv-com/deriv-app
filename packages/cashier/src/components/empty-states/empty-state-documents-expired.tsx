import { localize } from '@deriv/translations';
import React from 'react';
import EmptyState from '../empty-state';

const EmptyStateDocumentsExpired: React.FC = () => (
    <EmptyState
        icon={'IcCashierLocked'}
        title={localize('Cashier is locked')}
        description={localize(
            'The identification documents you submitted have expired. Please submit valid identity documents to unlock Cashier. '
        )}
    />
);

export default EmptyStateDocumentsExpired;
