import { localize, Localize } from '@deriv/translations';
import React from 'react';
import EmptyState from '../empty-state';

const EmptyStateAskTINInformation: React.FC = () => (
    <EmptyState
        icon={'IcCashierLocked'}
        title={localize('Cashier is locked')}
        description={
            <Localize
                i18n_default_text='You have not provided your tax identification number. This information is necessary for legal and regulatory requirements. Please go to <0>Personal details</0> in your account settings, and fill in your latest tax identification number.'
                components={[
                    <a key={0} className='link' rel='noopener noreferrer' href={'/account/personal-details'} />,
                ]}
            />
        }
    />
);

export default EmptyStateAskTINInformation;
