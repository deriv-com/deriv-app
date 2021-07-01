import React from 'react';
import { Popover, Icon, StaticUrl } from '@deriv/components';
import { localize } from '@deriv/translations';

export const HelpCentre = () => (
    <StaticUrl href='/help-centre/' id='dt_help_centre' aria-label={localize('Help centre')} className='footer__link'>
        <Popover classNameBubble='help-centre__tooltip' alignment='top' message={localize('Help centre')}>
            <Icon icon='IcHelpCentre' className='footer__icon' />
        </Popover>
    </StaticUrl>
);
