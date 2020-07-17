import React from 'react';
import { Icon, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import { BinaryLink } from 'App/Components/Routes';
import { connect } from 'Stores/connect';

const ToggleComplaintsPolicyWrapper = ({ accounts } = {}) => {
    const has_real_account = Object.values(accounts).some(account => !account.is_virtual);
    if (!has_real_account) return null;

    return (
        <React.Fragment>
            <Popover className='footer__link' alignment='top' message={localize('Complaints policy')}>
                <BinaryLink to={routes.complaints_policy}>
                    <Icon icon='IcComplaintsPolicy' className='footer__icon' />
                </BinaryLink>
            </Popover>
        </React.Fragment>
    );
};

const ToggleComplaintsPolicy = connect(({ client }) => ({
    accounts: client.accounts,
}))(ToggleComplaintsPolicyWrapper);

export { ToggleComplaintsPolicy };
