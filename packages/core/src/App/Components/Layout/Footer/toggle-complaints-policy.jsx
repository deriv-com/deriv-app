import React from 'react';
import { Icon, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import { BinaryLink } from 'App/Components/Routes';
import { connect } from 'Stores/connect';

const ToggleComplaintsPolicyWrapper = ({ landing_companies }) => {
    if (!landing_companies) return null;

    const { gaming_company, financial_company } = landing_companies;
    const shortcode = financial_company?.shortcode || gaming_company?.shortcode;
    if (!shortcode) return null;

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
    landing_companies: client.landing_companies,
}))(ToggleComplaintsPolicyWrapper);

export { ToggleComplaintsPolicy };
