import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Popover } from '@deriv/components';
import { routes, getStaticUrl, PlatformContext } from '@deriv/shared';
import { localize } from '@deriv/translations';

export const AccountLimits = () => {
    const { is_deriv_crypto } = React.useContext(PlatformContext);

    return (
        <Popover alignment='top' message={localize('Account limits')} className='footer__link'>
            <Link to={routes.account_limits} href={getStaticUrl('/', { is_deriv_crypto })}>
                <Icon icon='IcAccountLimits' className='footer__icon ic-deriv__icon' />
            </Link>
        </Popover>
    );
};
