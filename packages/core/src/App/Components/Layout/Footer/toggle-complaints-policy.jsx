import React from 'react';
import { Icon, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import { BinaryLink } from 'App/Components/Routes';

const ToggleComplaintsPolicy = ({ landing_company_shortcode } = {}) => {
    if (!landing_company_shortcode) return null;

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

export { ToggleComplaintsPolicy };
