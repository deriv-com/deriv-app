import React        from 'react';
import { localize } from 'App/i18n';
import Icon         from 'Assets/icon.jsx';
import { routes }   from 'Constants/index';

const header_links = [
    {
        id        : 'dt_reports_tab',
        icon      : <Icon icon='IconReports' className='header__icon' />,
        text      : localize('Reports'),
        link_to   : routes.reports,
        login_only: true,
    },
];

export default header_links;
