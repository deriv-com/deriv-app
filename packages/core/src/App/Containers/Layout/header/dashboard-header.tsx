import React from 'react';
import DashboardHeaderPreloader from './dashboard-header-preloader';
import { observer, useStore } from '@deriv/stores';
import LoggedOutHeader from './logged-out-header';
import LoggedInHeader from './logged-in-header';

const DashboardHeader = observer(() => {
    const { client } = useStore();
    const { is_logged_in, is_logging_in } = client;

    if (is_logging_in) {
        return <DashboardHeaderPreloader />;
    } else if (is_logged_in) {
        return <LoggedInHeader />;
    }
    return <LoggedOutHeader />;
});

export default DashboardHeader;
