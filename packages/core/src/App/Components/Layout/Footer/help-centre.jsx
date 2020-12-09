import React from 'react';
import { Popover, Icon, StaticUrl } from '@deriv/components';
import { localize } from '@deriv/translations';

export const HelpCentre = () => (
    <Popover
        className='footer__link'
        classNameBubble='help-centre__tooltip'
        alignment='top'
        message={localize('Help centre')}
    >
        <StaticUrl href='/help-centre/' id='dt_help_centre' aria-label={localize('Help centre')}>
            <Icon icon='IcHelpCentre' className='footer__icon' />
        </StaticUrl>
    </Popover>
);
