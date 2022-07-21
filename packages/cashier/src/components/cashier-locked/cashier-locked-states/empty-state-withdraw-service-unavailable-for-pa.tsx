import React from 'react';
import { localize } from '@deriv/translations';
import EmptyState from 'Components/empty-state';

const EmptyStateWithdrawServiceUnavailableForPA: React.FC = () => (
    <EmptyState
        icon={'IcCashierWithdrawalLock'}
        title={localize('Withdrawals are locked')}
        description={localize('This feature is not available for payment agents.')}
    />
);

export default EmptyStateWithdrawServiceUnavailableForPA;
