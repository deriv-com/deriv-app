import React from 'react';
import { Icon, Popover, StaticUrl } from '@deriv/components';
import { localize } from '@deriv/translations';

export const GoToDeriv = () => {
    const message = localize('Go to Deriv.com');

    return (
        <StaticUrl href='/' className='footer__link'>
            <Popover alignment='top' message={message}>
                <Icon icon='IcDerivOutline' className='footer__icon ic-deriv__icon' />
            </Popover>
        </StaticUrl>
    );
};
