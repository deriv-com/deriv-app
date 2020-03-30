import React from 'react';
import { Popover, Icon } from '@deriv/components';
import { localize, getLanguage } from '@deriv/translations';

const HelpCentre = () => {
    const lang = getLanguage().toLowerCase();
    const link_lang = lang === 'en' ? '' : `/${lang}`;

    return (
        <Popover
            className='footer__link'
            classNameBubble='help-centre__tooltip'
            alignment='top'
            message={localize('Help centre')}
        >
            <a
                href={`https://deriv.com${link_lang}/help-centre/`}
                id='dt_help_centre'
                target='_blank'
                rel='noopener noreferrer'
            >
                <Icon icon='IcHelpCentre' className='footer__icon' />
            </a>
        </Popover>
    );
};

export { HelpCentre };
