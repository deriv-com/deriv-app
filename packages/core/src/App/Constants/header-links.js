import React        from 'react';
import { localize } from 'App/i18n';
// import Icon         from 'Assets/icon.jsx';
import IconDeriv    from 'Assets/Header/NavBar/icon-deriv.jsx';
import { routes }   from 'Constants/index';

const header_links = [
    {
        id     : 'dt_deriv_logo',
        // TODO: Update naming.
        logo   : <div className='header__title'>{localize('DBot')}<span className='header__logo'>{localize('BETA')}</span></div>,
        image  : <IconDeriv className='header__icon' />,
        link_to: routes.trade,
    },
    // {
    //     icon      : <Icon icon='IconReports' className='header__icon' />,
    //     text      : localize('Reports'),
    //     link_to   : routes.reports,
    //     login_only: true,
    // },
];

export default header_links;
