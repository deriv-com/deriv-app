import { localize, Localize } from '@deriv/translations';
import React from 'react';
import EmptyState from '../empty-state';

const EmptyStateAskFinancialRiskApproval: React.FC = () => (
    <EmptyState
        icon={'IcCashierLocked'}
        title={localize('Cashier is locked')}
        description={
            <Localize
                i18n_default_text='Please complete the <0>Appropriateness Test</0> to access your cashier.'
                components={[
                    <a key={0} className='link' rel='noopener noreferrer' href={'/account/financial-assessment'} />,
                ]}
            />
        }
    />
);

export default EmptyStateAskFinancialRiskApproval;
