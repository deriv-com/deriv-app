import React from 'react';
import { Icon, Popover } from '@deriv/components';
import { getDerivComLink } from '@deriv/shared/utils/url';
import { localize } from '@deriv/translations';

export const GoToDeriv = () => (
    <div className='footer__link'>
        <a href={getDerivComLink('/')} target='_blank' rel='nofollow noreferrer'>
            <Popover alignment='bottom' message={localize('Go to deriv.com')}>
                <Icon icon='IcDerivOutline' className='footer__icon ic-deriv__icon' />
            </Popover>
        </a>
    </div>
);
