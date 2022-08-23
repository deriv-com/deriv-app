import React from 'react';
import { Tabs, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import DashboardComponents from './dashboard-components';
import SideBar from './dashboard-components/Sidebar';

interface SideBarProps {
    checkIfSidebarOpen: boolean;
    children: React.ReactElement;
}

const Dashboard = (props: SideBarProps) => {
    const [active_index, setActiveTabIndex] = React.useState<number>(0);
    const [showSideBar, setshowSideBar] = React.useState<boolean>(true);
    const dashBoradClass = 'dashboard__container ';
    const sidebarClasstoggle = showSideBar === false ? 'w-100' : '';
    return (
        <div className='main_dashboard_container'>
            <div className={dashBoradClass + sidebarClasstoggle}>
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
            <SideBar checkIfSidebarOpen={showSideBar} setSideBarState={setshowSideBar} />
        </div>
    );
};

export default Dashboard;
