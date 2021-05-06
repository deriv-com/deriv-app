import React from 'react';
import { Icon, Popover, StaticUrl } from '@deriv/components';
import { localize } from '@deriv/translations';
import { deriv_urls } from '@deriv/shared';

export const GoToDeriv = () => {
    const message = localize(`Go to ${deriv_urls.DERIV_HOST_NAME}`);

    return (
        <StaticUrl href='/' className='footer__link'>
            <Popover alignment='top' message={message}>
                <Icon icon='IcDerivOutline' className='footer__icon ic-deriv__icon' />
            </Popover>
        </StaticUrl>
    );
};
