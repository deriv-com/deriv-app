import React        from 'react';
import { Icon }     from 'deriv-components';
import { localize } from 'deriv-translations';
import { routes }   from 'Constants/index';

export const header_links = [
    {
        id        : 'dt_reports_tab',
        icon      : <Icon icon='IcReports' className='header__icon' />,
        text      : localize('Reports'),
        link_to   : routes.reports,
        login_only: true,
    },
    {
        id        : 'dt_cashier_tab',
        icon      : <Icon icon='IcCashier' className='header__icon' />,
        text      : localize('Cashier'),
        link_to   : routes.cashier,
        login_only: true,
    },
];
