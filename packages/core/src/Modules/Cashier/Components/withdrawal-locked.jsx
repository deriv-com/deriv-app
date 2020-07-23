import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { Icon, Checklist } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const WithdrawalLocked = ({ account_status, history }) => {
    const { identity, needs_verification } = account_status.authentication;
    const is_poi_needed = needs_verification.includes('identity');
    const has_poi_submitted = identity.status !== 'none';
    const poi_text = has_poi_submitted
        ? localize('Check proof of identity document verification status')
        : localize('Upload a proof of identity to verify your identity');

    const items = [
        {
            content: poi_text,
            status: 'action',
            onClick: () => history.push(routes.proof_of_identity),
        },
    ];
    return (
        <div className='cashier-locked'>
            <Icon icon='IcMoneyTransfer' className='cashier-locked__icon' />
            <h2 className='cashier-locked__title'>{localize('Withdrawals are locked')}</h2>

            {is_poi_needed ? (
                <>
                    <p className='cashier-locked__desc'>
                        {localize('To enable this feature you must complete the following:')}
                    </p>
                    <Checklist className='cashier-locked__checklist' items={items} />
                </>
            ) : (
                <p className='cashier-locked__desc'>{localize('Please check your email for details.')}</p>
            )}
        </div>
    );
};

WithdrawalLocked.propTypes = {
    account_status: PropTypes.object,
    is_financial_account: PropTypes.bool,
};

export default connect(({ client }) => ({
    account_status: client.account_status,
    is_financial_account: client.is_financial_account,
}))(withRouter(WithdrawalLocked));
