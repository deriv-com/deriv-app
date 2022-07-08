import { localize } from '@deriv/translations';
import React from 'react';
import EmptyState from '../empty-state';

const EmptyStateWithdrawServiceUnavailableForPA: React.FC = () => (
    <EmptyState
        icon={'IcCashierWithdrawalLock'}
        title={localize('Withdrawals are locked')}
        description={localize('This feature is not available for payment agents.')}
    />
);

export default EmptyStateWithdrawServiceUnavailableForPA;
