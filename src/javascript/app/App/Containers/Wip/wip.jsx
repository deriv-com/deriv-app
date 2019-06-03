import React        from 'react';
import BinarySocket from '_common/base/socket_base';
import { localize } from '_common/localize';
import { urlFor }   from '_common/url';
import Localize     from 'App/Components/Elements/localize.jsx';
import Button       from 'App/Components/Form/button.jsx';
import { IconWip }  from 'Assets/Common/icon-wip.jsx';
import { connect }  from 'Stores/connect';
import GTM          from 'Utils/gtm';

const onClick = () => {
    window.location.href = window.open(urlFor('trading', undefined, undefined, true));
};

const Wip = (ui) => {
    BinarySocket.wait('website_status').then(() => {
        GTM.pushDataLayer({ event: 'page_load' });
    });

    return (
        <div className='work-in-progress'>
            <div className='work-in-progress__content'>
                <IconWip theme={ui.is_dark_mode ? 'dark' : 'light'} />
                <div className='work-in-progress__header'>
                    <Localize str='Work in progress!' />
                </div>
                <div className='work-in-progress__text'>
                    <Localize str='This is currently unavailable for mobile devices.' />
                </div>
                <Button
                    className='work-in-progress__btn'
                    classNameSpan='work-in-progress__btn--span'
                    onClick={onClick}
                    text={localize('Take me to SmartTrader')}
                />
            </div>
        </div>
    );
};

export default connect(({ ui }) => (
    {
        is_dark_mode: ui.is_dark_mode_on,
    }
))(Wip);
