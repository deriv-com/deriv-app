import React           from 'react';
import { localize }    from '_common/localize';
import { Icon }        from 'Assets/Common';
import { IconReports } from 'Assets/Header/NavBar/index';
import { routes }      from 'Constants/index';

const header_links = [
    {
        logo   : <div className='header__logo'>{localize('BETA')}</div>,
        text   : localize('Deriv'),
        link_to: routes.trade,
    },
    {
        icon      : <Icon icon={IconReports} className='header__icon' />,
        text      : localize('Reports'),
        link_to   : routes.reports,
        login_only: true,
    },
];

export default header_links;
