import React from 'react';
import { Tabs, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import DashboardComponents from './dashboard-components';
import SideBar from './dashboard-components/Sidebar';

const Dashboard: React.FC = () => {
    const [active_index, setActiveTabIndex] = React.useState(0);

    return (
        <div className='main_dashboard_container'>
            <div className='dashboard__container'>
                <Tabs active_index={active_index} onTabItemClick={setActiveTabIndex} top>
                    {/* [Todo] needs to update tabs component children instead of using label property */}
                    <div label={localize('Dashboard')}>
                        <DashboardComponents />
                    </div>
                    <div label='Bot Builder'>
                        <div>Contennt 3</div>
                    </div>
                    <div label='Quick Strategy' />
                    <div label='Charts' />
                    <div label='Tutorial'>
                        <div>Contennt 4</div>
                    </div>
                </Tabs>
            </div>
            <SideBar />
        </div>
    );
};

export default Dashboard;
