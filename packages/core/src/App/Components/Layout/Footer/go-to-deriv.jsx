import React from 'react';
import { Icon, Popover, StaticUrl } from '@deriv/components';
import { localize } from '@deriv/translations';

export const GoToDeriv = () => {
    const message = localize('Go to Deriv.com');

    return (
        <Popover alignment='top' message={message} className='footer__link'>
            <StaticUrl href='/'>
                <Icon icon='IcDerivOutline' className='footer__icon ic-deriv__icon' />
            </StaticUrl>
        </Popover>
    );
};
