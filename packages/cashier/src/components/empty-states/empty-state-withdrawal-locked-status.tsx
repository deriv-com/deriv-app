import { localize } from '@deriv/translations';
import React from 'react';
import EmptyState from '../empty-state';

const EmptyStateWithdrawalLockedStatus: React.FC = () => (
    <EmptyState
        icon={'IcCashierWithdrawalLock'}
        title={localize('Withdrawals are locked')}
        description={localize(
            'Unfortunately, you can only make deposits. Please contact us via live chat to enable withdrawals.'
        )}
    />
);

export default EmptyStateWithdrawalLockedStatus;
