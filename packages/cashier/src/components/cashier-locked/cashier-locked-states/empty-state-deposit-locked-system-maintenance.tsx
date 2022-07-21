import React from 'react';
import { localize } from '@deriv/translations';
import EmptyState from 'Components/empty-state';

const EmptyStateDepositLockedSystemMaintenance: React.FC = () => (
    <EmptyState
        icon={'IcCashierLocked'}
        title={localize('Cashier is locked')}
        description={localize(
            'Deposits are temporarily unavailable due to system maintenance. You can make your deposits when the maintenance is complete.'
        )}
    />
);

export default EmptyStateDepositLockedSystemMaintenance;
