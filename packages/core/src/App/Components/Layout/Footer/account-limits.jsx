import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Popover } from '@deriv/components';
import { routes, getDerivComLink } from '@deriv/shared';
import { localize } from '@deriv/translations';

export const AccountLimits = () => (
    <Popover alignment='top' message={localize('Account limits')} className='footer__link'>
        <Link to={routes.account_limits} href={getDerivComLink('/')}>
            <Icon icon='IcAccountLimits' className='footer__icon ic-deriv__icon' />
        </Link>
    </Popover>
);
