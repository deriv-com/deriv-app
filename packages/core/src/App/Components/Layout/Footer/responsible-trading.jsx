import React from 'react';
import { Icon, Popover, StaticUrl } from '@deriv/components';
import { localize } from '@deriv/translations';

export const ResponsibleTrading = () => (
    <Popover alignment='top' message={localize('Responsible trading')} className='footer__link'>
        <StaticUrl href='/responsible'>
            <Icon icon='IcVerification' className='footer__icon ic-deriv__icon' />
        </StaticUrl>
    </Popover>
);
