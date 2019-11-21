import React        from 'react';
import { Icon }     from 'deriv-components';
import { localize } from 'App/i18n';
import { routes }   from 'Constants/index';

const header_links = [
    {
        id        : 'dt_reports_tab',
        icon      : <Icon icon='IcReports' className='header__icon' />,
        text      : localize('Reports'),
        href      : routes.reports,
        login_only: true,
    },
];

export default header_links;
