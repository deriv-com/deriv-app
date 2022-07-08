import { localize, Localize } from '@deriv/translations';
import React from 'react';
import EmptyState from '../empty-state';

const EmptyStateDepositLockedAskFixDetails: React.FC = () => (
    <EmptyState
        icon={'IcCashierDepositLock'}
        title={localize('Deposits are locked')}
        description={
            <Localize
                i18n_default_text='Your <0>personal details</0> are incomplete. Please go to your account settings and complete your personal details to enable deposits.'
                components={[
                    <a key={0} className='link' rel='noopener noreferrer' href={'/account/personal-details'} />,
                ]}
            />
        }
    />
);

export default EmptyStateDepositLockedAskFixDetails;
