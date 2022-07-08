import { localize } from '@deriv/translations';
import React from 'react';
import EmptyState from '../empty-state';

const EmptyStateOnlyPAWithdrawalsAllowedStatus: React.FC = () => (
    <EmptyState
        icon={'IcCashierWithdrawalLock'}
        title={localize('Withdrawals are locked')}
        description={localize('You can only make deposits. Please contact us via live chat for more information.')}
    />
);

export default EmptyStateOnlyPAWithdrawalsAllowedStatus;
