import React from 'react';
import { useHistory } from 'react-router-dom';
import { isDashboard } from '@deriv/shared';
import DefaultHeader from './default-header.jsx';
import DashboardHeader from './dashboard-header.jsx';

const Header = () => {
    const history = useHistory();
    const [is_dashboard, setIsDashboard] = React.useState(false);

    React.useEffect(() => {
        const determineHeader = () => setIsDashboard(isDashboard());
        const unlisten = history.listen(determineHeader, []);

        determineHeader();

        return unlisten;
    });

    return is_dashboard ? <DashboardHeader /> : <DefaultHeader />;
};

export default Header;
