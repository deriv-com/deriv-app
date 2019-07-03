import React           from 'react';
import { localize }    from 'App/i18n';
import Icon            from 'Assets/icon.jsx';
import { routes }      from 'Constants/index';

const header_links = [
    {
        logo   : <div className='header__logo'>{localize('BETA')}</div>,
        image  : <Icon icon='IconDeriv' className='header__icon' />,
        link_to: routes.trade,
    },
    {
        icon      : <Icon icon='IconReports' className='header__icon' />,
        text      : localize('Reports'),
        link_to   : routes.reports,
        login_only: true,
    },
];

export default header_links;
