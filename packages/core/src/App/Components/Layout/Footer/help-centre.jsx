import React from 'react';
import { Popover, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getDerivComLink } from '_common/url';

const HelpCentre = () => {
    return (
        <Popover
            className='footer__link'
            classNameBubble='help-centre__tooltip'
            alignment='top'
            message={localize('Help centre')}
        >
            <a href={getDerivComLink()} id='dt_help_centre' target='_blank' rel='noopener noreferrer'>
                <Icon icon='IcHelpCentre' className='footer__icon' />
            </a>
        </Popover>
    );
};

export { HelpCentre };
