import React from 'react';
import { Popover, Icon } from '@deriv/components';
import { getStaticUrl, PlatformContext } from '@deriv/shared';
import { localize } from '@deriv/translations';

const HelpCentre = () => {
    const { is_deriv_crypto } = React.useContext(PlatformContext);

    return (
        <Popover
            className='footer__link'
            classNameBubble='help-centre__tooltip'
            alignment='top'
            message={localize('Help centre')}
        >
            <a
                href={getStaticUrl('/help-centre/', { is_deriv_crypto })}
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
