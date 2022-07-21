import { localize, Localize } from '@deriv/translations';
import EmptyState from 'Components/empty-state';
import React from 'react';

const EmptyStateAskFinancialRiskApproval: React.FC = () => (
    <EmptyState
        icon={'IcCashierLocked'}
        title={localize('Cashier is locked')}
        description={
            <Localize
                i18n_default_text='Please complete the <0>Appropriateness Test</0> to access your cashier.'
                components={[
                    <a
                        key={0}
                        className='link'
                        rel='noopener noreferrer'
                        href={'/account/financial-assessment'}
                        data-testid='dt_financial_assessment_link'
                    />,
                ]}
            />
        }
    />
);

export default EmptyStateAskFinancialRiskApproval;
