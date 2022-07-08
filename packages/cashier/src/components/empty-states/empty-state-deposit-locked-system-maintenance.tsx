import { localize } from '@deriv/translations';
import React from 'react';
import EmptyState from '../empty-state';

const EmptyStateDepositLockedSystemMaintenance: React.FC = () => (
    <EmptyState
        icon={'IcCashierLocked'}
        title={localize('Cashier is locked')}
        description={localize(
            'Our cashier is temporarily down due to system maintenance. You can access the Cashier in a few minutes when the maintenance is complete.'
        )}
    />
);

export default EmptyStateDepositLockedSystemMaintenance;
