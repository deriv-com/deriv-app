import React from 'react';
import { PlatformContext } from '@deriv/shared';
import DefaultHeader from './default-header.jsx';
import DashboardHeader from './dashboard-header.jsx';

const Header = () => {
    const { is_dashboard } = React.useContext(PlatformContext);
    return is_dashboard ? <DashboardHeader /> : <DefaultHeader />;
};

export default Header;
