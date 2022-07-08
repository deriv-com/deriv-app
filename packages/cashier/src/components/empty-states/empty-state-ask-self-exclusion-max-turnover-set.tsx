import { localize, Localize } from '@deriv/translations';
import React from 'react';
import EmptyState from '../empty-state';

const EmptyStateAskSelfExclusionMaxTurnoverSet: React.FC = () => (
    <EmptyState
        icon={'IcCashierLocked'}
        title={localize('Cashier is locked')}
        description={
            <Localize
                i18n_default_text='Your access to Cashier has been temporarily disabled as you have not set your 30-day turnover limit. Please go to <0>Self-exclusion</0> and set your 30-day turnover limit.'
                components={[<a key={0} className='link' rel='noopener noreferrer' href={'/account/self-exclusion'} />]}
            />
        }
    />
);

export default EmptyStateAskSelfExclusionMaxTurnoverSet;
