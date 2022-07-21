import { localize } from '@deriv/translations';
import EmptyState from 'Components/empty-state';
import React from 'react';

const EmptyStateAskCurrency: React.FC = () => (
    <EmptyState
        icon={'IcCashierLocked'}
        title={localize('Cashier is locked')}
        description={localize('Please set your account currency to enable deposits and withdrawals.')}
    />
);

export default EmptyStateAskCurrency;
