import React from 'react';
import { Popover, Icon } from '@deriv/components';
import { getDerivComLink } from '@deriv/shared';
import { localize } from '@deriv/translations';

const HelpCentre = () => {
    return (
        <Popover
            className='footer__link'
            classNameBubble='help-centre__tooltip'
            alignment='top'
            message={localize('Help centre')}
        >
            <a
                href={getDerivComLink('/help-centre/')}
                id='dt_help_centre'
                target='_blank'
                rel='noopener noreferrer'
                aria-label={localize('Help centre')}
            >
                <Icon icon='IcHelpCentre' className='footer__icon' />
            </a>
        </Popover>
    );
};

export { HelpCentre };
