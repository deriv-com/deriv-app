import { localize } from '@deriv/translations';
import EmptyState from 'Components/empty-state';
import React from 'react';

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
