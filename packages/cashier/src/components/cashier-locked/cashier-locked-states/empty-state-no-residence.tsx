import { localize } from '@deriv/translations';
import EmptyState from 'Components/empty-state';
import React from 'react';

const EmptyStateNoResidence: React.FC = () => (
    <EmptyState
        icon={'IcCashierLocked'}
        title={localize('Cashier is locked')}
        description={localize(
            'You’ve not set your country of residence. To access Cashier, please update your country of residence in the Personal details section in your account settings.'
        )}
    />
);

export default EmptyStateNoResidence;
