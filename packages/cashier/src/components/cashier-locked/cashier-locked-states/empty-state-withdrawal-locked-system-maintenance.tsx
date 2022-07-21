import { localize } from '@deriv/translations';
import EmptyState from 'Components/empty-state';
import React from 'react';

const EmptyStateWithdrawalLockedSystemMaintenance: React.FC = () => (
    <EmptyState
        icon={'IcCashierLocked'}
        title={localize('Withdrawals are locked')}
        description={localize(
            'Withdrawals are temporarily unavailable due to system maintenance. You can make your withdrawals when the maintenance is complete.'
        )}
    />
);

export default EmptyStateWithdrawalLockedSystemMaintenance;
