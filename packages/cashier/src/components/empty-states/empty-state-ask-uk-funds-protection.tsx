import { localize, Localize } from '@deriv/translations';
import React from 'react';
import EmptyState from '../empty-state';

const EmptyStateAskUKFundsProtection: React.FC = () => (
    <EmptyState
        icon={'IcCashierLocked'}
        title={localize('Cashier is locked')}
        description={
            <Localize
                i18n_default_text='Your cashier is locked. See <0>how we protect your funds</0> before you proceed.'
                components={[<a key={0} className='link' rel='noopener noreferrer' href={'/cashier/deposit'} />]}
            />
        }
    />
);

export default EmptyStateAskUKFundsProtection;
