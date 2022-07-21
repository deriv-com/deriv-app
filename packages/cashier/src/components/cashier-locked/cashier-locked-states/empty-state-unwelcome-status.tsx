import { localize } from '@deriv/translations';
import EmptyState from 'Components/empty-state';
import React from 'react';

const EmptyStateUnwelcomeStatus: React.FC = () => (
    <EmptyState
        icon={'IcCashierDepositLock'}
        title={localize('Deposits are locked')}
        description={localize('Please contact us via live chat.')}
    />
);

export default EmptyStateUnwelcomeStatus;
