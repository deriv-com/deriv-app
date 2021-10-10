import React from 'react';
import { Icon, Popover, StaticUrl } from '@deriv/components';
import { localize } from '@deriv/translations';

export const ResponsibleTrading = () => (
    <StaticUrl href='/responsible' className='footer__link'>
        <Popover alignment='top' message={localize('Responsible trading')} zIndex={9999}>
            <Icon icon='IcVerification' className='footer__icon ic-deriv__icon' />
        </Popover>
    </StaticUrl>
);
