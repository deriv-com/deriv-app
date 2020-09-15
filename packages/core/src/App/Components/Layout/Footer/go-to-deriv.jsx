import React from 'react';
import { Icon, Popover } from '@deriv/components';
import { getStaticUrl, PlatformContext } from '@deriv/shared';
import { localize } from '@deriv/translations';

export const GoToDeriv = () => {
    const { is_deriv_crypto } = React.useContext(PlatformContext);
    const message = is_deriv_crypto ? localize('Go to Derivcrypto.com') : localize('Go to Deriv.com');

    return (
        <Popover alignment='top' message={message} className='footer__link'>
            <a href={getStaticUrl('/', { is_deriv_crypto })} target='_blank' rel='nofollow noreferrer'>
                <Icon icon='IcDerivOutline' className='footer__icon ic-deriv__icon' />
            </a>
        </Popover>
    );
};
