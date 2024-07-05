import React from 'react';
import { Popover, Icon, StaticUrl } from '@deriv/components';
import { localize } from '@deriv/translations';

export const HelpCentre = ({ showPopover }) => (
    <StaticUrl href='/help-centre/' id='dt_help_centre' aria-label={localize('Help centre')} className='footer__link'>
        {showPopover ? (
            <Popover
                classNameBubble='help-centre__tooltip'
                alignment='top'
                message={localize('Help centre')}
                zIndex={9999}
            >
                <Icon icon='IcHelpCentre' className='footer__icon' />
            </Popover>
        ) : (
            <Icon icon='IcHelpCentre' className='footer__icon' />
        )}
    </StaticUrl>
);
