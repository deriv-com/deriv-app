import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Popover } from '@deriv/components';
import { routes, getDerivComLink } from '@deriv/shared';
import { localize } from '@deriv/translations';

export const AccountLimits = () => (
    <div className='footer__link'>
        <Link to={routes.account_limits} href={getDerivComLink('/')}>
            <Popover alignment='bottom' message={localize('Account limits')}>
                <Icon icon='IcAccountLimits' className='footer__icon ic-deriv__icon' />
            </Popover>
        </Link>
    </div>
);
