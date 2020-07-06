import React from 'react';
import { Icon } from '@deriv/components';
import { routes } from '@deriv/shared';
import { localize } from '@deriv/translations';
import CashierNotifications from 'Modules/Cashier/Containers/cashier-notifications.jsx';

export const header_links = [
    {
        id: 'dt_reports_tab',
        icon: <Icon icon='IcReports' className='header__icon' />,
        text: () => localize('Reports'),
        link_to: routes.reports,
        login_only: true,
    },
    {
        id: 'dt_cashier_tab',
        icon: <CashierNotifications />,
        text: () => localize('Cashier'),
        link_to: routes.cashier,
        login_only: true,
    },
];
