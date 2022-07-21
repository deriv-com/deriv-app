import React from 'react';
import { localize } from '@deriv/translations';
import EmptyState from 'Components/empty-state';

const EmptyStateOnlyPAWithdrawalsAllowedStatus: React.FC = () => (
    <EmptyState
        icon={'IcCashierWithdrawalLock'}
        title={localize('Withdrawals are locked')}
        description={localize('You can only make deposits. Please contact us via live chat for more information.')}
    />
);

export default EmptyStateOnlyPAWithdrawalsAllowedStatus;
