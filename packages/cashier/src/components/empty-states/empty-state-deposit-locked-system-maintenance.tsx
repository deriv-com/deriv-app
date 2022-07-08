import { localize } from '@deriv/translations';
import React from 'react';
import EmptyState from '../empty-state';

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
