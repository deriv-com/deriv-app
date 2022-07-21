import { localize } from '@deriv/translations';
import EmptyState from 'Components/empty-state';
import React from 'react';

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
