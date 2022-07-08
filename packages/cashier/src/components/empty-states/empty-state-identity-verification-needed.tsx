import { localize, Localize } from '@deriv/translations';
import React from 'react';
import EmptyState from '../empty-state';

const EmptyStateIdentityVerificationNeeded: React.FC = () => (
    <EmptyState
        icon={'IcCashierLocked'}
        title={localize('Cashier is locked')}
        description={
            <Localize
                i18n_default_text='Please submit your <0>proof of identity</0> to authenticate your account and access your Cashier.'
                components={[<a key={0} className='link' href={'/account/proof-of-identity'} />]}
            />
        }
    />
);

export default EmptyStateIdentityVerificationNeeded;
