import React from 'react';
import { Icon, Popover } from '@deriv/components';
import { getDerivComLink } from '@deriv/shared';
import { localize } from '@deriv/translations';

export const ResponsibleTrading = () => (
    <Popover alignment='top' message={localize('Responsible trading')} className='footer__link'>
        <a href={getDerivComLink('/responsible-trading')} target='_blank' rel='nofollow noreferrer'>
            <Icon icon='IcVerification' className='footer__icon ic-deriv__icon' />
        </a>
    </Popover>
);
