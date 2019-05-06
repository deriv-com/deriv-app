import React             from 'react';
import { localize }      from '_common/localize';
// import { IconStatement } from 'Assets/Header/NavBar/index';
import { routes }        from 'Constants/index';

const header_links = [
    {
        logo   : <div className='header__logo'>{localize('BETA')}</div>,
        text   : localize('BinaryNex'),
        link_to: routes.trade,
    },
    // {
    //     icon      : <IconStatement className='header__icon' />,
    //     text      : localize('Reports'),
    //     link_to   : routes.statement,
    //     login_only: true,
    // },
];

export default header_links;
