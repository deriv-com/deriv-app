import React from 'react';
import { withRouter } from 'react-router-dom';
import { PlatformContext, getDashboardPlatformHeader } from '@deriv/shared';
import { connect } from 'Stores/connect';
import DefaultHeader from './default-header.jsx';
import DashboardPlatformHeader from './dashboard-platform-header.jsx';
import DashboardHeader from './dashboard-header.jsx';

const Header = ({ app_routing_history }) => {
    const { is_dashboard } = React.useContext(PlatformContext);

    if (is_dashboard) {
        if (getDashboardPlatformHeader(app_routing_history)) {
            return <DashboardPlatformHeader />;
        }
        return <DashboardHeader />;
    }
    return <DefaultHeader />;
};

export default connect(({ common }) => ({
    app_routing_history: common.app_routing_history,
}))(withRouter(Header));
