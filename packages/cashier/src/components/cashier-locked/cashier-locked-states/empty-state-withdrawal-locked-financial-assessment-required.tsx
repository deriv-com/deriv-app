import { localize, Localize } from '@deriv/translations';
import EmptyState from 'Components/empty-state';
import React from 'react';

const EmptyStateWithdrawalLockedFinancialAssessmentRequired: React.FC = () => (
    <EmptyState
        icon={'IcCashierWithdrawalLock'}
        title={localize('Withdrawals are locked')}
        description={
            <Localize
                i18n_default_text='You can only make deposits. Please complete the <0>financial assessment</0> to unlock withdrawals.'
                components={[
                    <a
                        key={0}
                        className='link'
                        href={'/account/financial-assessment'}
                        data-testid='dt_financial_assessment_link'
                    />,
                ]}
            />
        }
    />
);

export default EmptyStateWithdrawalLockedFinancialAssessmentRequired;
