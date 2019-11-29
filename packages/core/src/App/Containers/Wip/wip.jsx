import { Button }             from 'deriv-components';
import React                  from 'react';
import BinarySocket           from '_common/base/socket_base';
import { urlFor }             from '_common/url';
import { localize, Localize } from 'deriv-translations';
import Icon                   from 'Assets/icon.jsx';
import { connect }            from 'Stores/connect';
import 'Sass/app/_common/components/wip.scss';

const onClick = (e) => {
    e.preventDefault();
    window.open(urlFor('trading', undefined, undefined, true), '_blank', 'noopener, noreferrer');
};

const Wip = ({ is_dark_mode, pushDataLayer }) => {
    BinarySocket.wait('website_status').then(() => {
        pushDataLayer({ event: 'page_load' });
    });

    return (
        <div className='work-in-progress'>
            <div className='work-in-progress__content'>
                <Icon icon='IconWip' theme={is_dark_mode ? 'dark' : 'light'} />
                <div className='work-in-progress__header'>
                    <Localize i18n_default_text='Work in progress!' />
                </div>
                <div className='work-in-progress__text'>
                    <Localize i18n_default_text='This is currently unavailable for mobile devices.' />
                </div>
                <Button
                    className='work-in-progress__btn'
                    classNameSpan='work-in-progress__btn--span'
                    onClick={onClick}
                    text={localize('Take me to SmartTrader')}
                    primary
                />
            </div>
        </div>
    );
};

export default connect(({ ui, gtm }) => (
    {
        is_dark_mode : ui.is_dark_mode_on,
        pushDataLayer: gtm.pushDataLayer,
    }
))(Wip);
