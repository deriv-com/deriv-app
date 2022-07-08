import { localize } from '@deriv/translations';
import React from 'react';
import EmptyState from '../empty-state';

const EmptyStateCashierLockedStatus: React.FC = () => (
    <EmptyState
        icon={'IcCashierLocked'}
        title={localize('Cashier is locked')}
        description={localize(
            'Your cashier is currently locked. Please contact us via live chat to find out how to unlock it.'
        )}
    />
);

export default EmptyStateCashierLockedStatus;
