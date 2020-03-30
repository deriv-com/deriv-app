import React from 'react';
import { Popover } from '@deriv/components';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';

class HelpCentre extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Popover
                className='footer__link'
                classNameBubble='help-centre__tooltip'
                alignment='top'
                message={localize('Help centre')}
            >
                <a href='https://deriv.com/help-centre/' id='dt_help_centre' target='_blank' rel='noopener'>
                    <Icon icon='IcHelpCentre' className='footer__icon' />
                </a>
            </Popover>
        );
    }
}

export { HelpCentre };
