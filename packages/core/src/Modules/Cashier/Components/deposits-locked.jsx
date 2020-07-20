import React from 'react';
import { routes } from '@deriv/shared';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { BinaryLink } from 'App/Components/Routes';

const DepositsLocked = ({ account_status }) => {
    if (!account_status) return null;
    const { need_verification } = account_status.authentication;
    const is_poi_needed = need_verification.includes('identity');
    const is_poa_needed = need_verification.includes('document');
    return (
        <div className='funds-protection'>
            <Icon icon='IcMoneyTransfer' className='funds-protection__icon' />
            <h2 className='funds-protection__title'>{localize('Deposits are locked')}</h2>
            <p className='funds-protection__desc'>
                {localize('To enable this feature you must complete the following:')}
            </p>
            {is_poi_needed && (
                <BinaryLink className='link' to={routes.proof_of_identity}>
                    {localize('Upload an ID document to verify your identity')}
                </BinaryLink>
            )}
            {is_poa_needed && (
                <BinaryLink className='link' to={routes.proof_of_address}>
                    {localize('Upload a proof of address to verify your address')}
                </BinaryLink>
            )}
        </div>
    );
};

export default connect(({ client }) => ({
    account_status: client.account_status,
}))(DepositsLocked);
