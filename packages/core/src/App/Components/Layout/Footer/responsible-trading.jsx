import React from 'react';
import { Icon, Popover } from '@deriv/components';
import { getStaticUrl, PlatformContext } from '@deriv/shared';
import { localize } from '@deriv/translations';

export const ResponsibleTrading = () => {
    const { is_deriv_crypto } = React.useContext(PlatformContext);
    return (
        <Popover alignment='top' message={localize('Responsible trading')} className='footer__link'>
            <a
                href={getStaticUrl('/responsible-trading', { is_deriv_crypto })}
                target='_blank'
                rel='nofollow noreferrer'
            >
                <Icon icon='IcVerification' className='footer__icon ic-deriv__icon' />
            </a>
        </Popover>
    );
};
