import React from 'react';
import { Icon, Popover } from '@deriv/components';
import { getDerivComLink } from '@deriv/shared';
import { localize } from '@deriv/translations';

export const GoToDeriv = () => (
    <Popover alignment='top' message={localize('Go to Deriv.com')} className='footer__link'>
        <a href={getDerivComLink('/')} target='_blank' rel='nofollow noreferrer'>
            <Icon icon='IcDerivOutline' className='footer__icon ic-deriv__icon' />
        </a>
    </Popover>
);
