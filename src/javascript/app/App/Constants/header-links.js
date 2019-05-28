<<<<<<< HEAD
import React        from 'react';
import { localize } from '_common/localize';
import Icon         from 'Assets/Common';
import { routes }   from 'Constants/index';
=======
import React           from 'react';
import { localize }    from '_common/localize';
import { Icon }        from 'Assets/Common';
import {
    IconReports,
    IconDeriv }        from 'Assets/Header/NavBar/index';
import { routes }      from 'Constants/index';
>>>>>>> e79bd60f02f95b61175386c2f75292b1bb035f9e

const header_links = [
    {
        logo   : <div className='header__logo'>{localize('BETA')}</div>,
        image  : <Icon icon={IconDeriv} className='header__icon' />,
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
