import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Popover } from '@deriv-app/components';
import { routes } from '@deriv-app/shared';
import { localize } from '@deriv-app/translations';

export const AccountLimits = ({ showPopover }) => (
    <Link to={routes.account_limits} className='footer__link'>
        {showPopover ? (
            <Popover alignment='top' message={localize('Account limits')} zIndex={9999}>
                <Icon icon='IcAccountLimits' className='footer__icon ic-deriv__icon' />
            </Popover>
        ) : (
            <Icon icon='IcAccountLimits' className='footer__icon ic-deriv__icon' />
        )}
    </Link>
);
