import { localize, Localize } from '@deriv/translations';
import React from 'react';
import EmptyState from '../empty-state';

const EmptyStateCashierLockedFinancialAssessmentRequired: React.FC = () => (
    <EmptyState
        icon={'IcCashierLocked'}
        title={localize('Cashier is locked')}
        description={
            <Localize
                i18n_default_text='Your cashier is locked. Please complete the <0>financial assessment</0> to unlock it.'
                components={[
                    <a key={0} className='link' rel='noopener noreferrer' href={'/account/financial-assessment'} />,
                ]}
            />
        }
    />
);

export default EmptyStateCashierLockedFinancialAssessmentRequired;
