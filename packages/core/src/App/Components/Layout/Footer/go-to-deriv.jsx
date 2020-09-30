import React from 'react';
import { Icon, Popover, StaticUrl } from '@deriv/components';
import { localize } from '@deriv/translations';
import { PlatformContext } from '@deriv/shared';

export const GoToDeriv = () => {
    const { is_deriv_crypto } = React.useContext(PlatformContext);
    const message = is_deriv_crypto ? localize('Go to Derivcrypto.com') : localize('Go to Deriv.com');

    return (
        <Popover alignment='top' message={message} className='footer__link'>
            <StaticUrl href='/'>
                <Icon icon='IcDerivOutline' className='footer__icon ic-deriv__icon' />
            </StaticUrl>
        </Popover>
    );
};
