import React from 'react';
import { localize } from '@deriv/translations';
import EmptyState from 'Components/empty-state';

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
