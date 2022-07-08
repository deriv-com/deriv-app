import { localize, Localize } from '@deriv/translations';
import React from 'react';
import EmptyState from '../empty-state';

const EmptyStateWithdrawalLockedFinancialAssessmentRequired: React.FC = () => (
    <EmptyState
        icon={'IcCashierWithdrawalLock'}
        title={localize('Withdrawals are locked')}
        description={
            <Localize
                i18n_default_text='You can only make deposits. Please complete the <0>financial assessment</0> to unlock withdrawals.'
                components={[<a key={0} className='link' href={'/account/financial-assessment'} />]}
            />
        }
    />
);

export default EmptyStateWithdrawalLockedFinancialAssessmentRequired;
