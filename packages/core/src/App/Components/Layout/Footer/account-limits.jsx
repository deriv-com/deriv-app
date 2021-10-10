import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Popover } from '@deriv/components';
import { routes } from '@deriv/shared';
import { localize } from '@deriv/translations';

export const AccountLimits = () => (
    <Link to={routes.account_limits} className='footer__link'>
        <Popover alignment='top' message={localize('Account limits')} zIndex={9999}>
            <Icon icon='IcAccountLimits' className='footer__icon ic-deriv__icon' />
        </Popover>
    </Link>
);
