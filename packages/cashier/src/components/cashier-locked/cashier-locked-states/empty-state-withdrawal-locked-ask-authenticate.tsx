import { localize, Localize } from '@deriv/translations';
import EmptyState from 'Components/empty-state';
import React from 'react';

const EmptyStateWithdrawalLockedAskAuthenticate: React.FC = () => (
    <EmptyState
        icon={'IcCashierWithdrawalLock'}
        title={localize('Withdrawals are locked')}
        description={
            <Localize
                i18n_default_text='Your account has not been authenticated. Please submit your <0>proof of identity</0> and <1>proof of address</1> to authenticate your account and request for withdrawals.'
                components={[
                    <a key={0} className='link' rel='noopener noreferrer' href={'/account/proof-of-identity'} />,
                    <a key={1} className='link' rel='noopener noreferrer' href={'/account/proof-of-address'} />,
                ]}
            />
        }
    />
);

export default EmptyStateWithdrawalLockedAskAuthenticate;
