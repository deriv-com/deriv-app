import React from 'react';
import { Tabs, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import Chart from 'Components/chart';
import DashboardComponents from './dashboard-components';
import SideBar from './dashboard-components/Sidebar';
import ReactJoyride from 'react-joyride';
import JoyrideConfig from './joyrideConfig';
import BotBuilder from './bot-builder';
import Translations from './dashboard-components/Translations';

interface SideBarProps {
    checkIfSidebarOpen: boolean;
    children: React.ReactElement;
}

const Dashboard = (props: SideBarProps) => {
    const [active_index, setActiveTabIndex] = React.useState<number>(0);
    const [showSideBar, setshowSideBar] = React.useState<boolean>(true);
    const dashBoradClass = 'dashboard__container ';
    const sidebarClasstoggle = showSideBar === false ? 'w-100' : '';
    const { DashBorardSteps } = JoyrideConfig;
    const [tourRun, setTourRun] = React.useState<boolean>(true);
    const handleClick = (e: any) => {
        e.preventDefault();
        setTourRun(true);
    };
    return (
        <div className='main_dashboard_container'>
            <div className={dashBoradClass + sidebarClasstoggle}>
                <ReactJoyride steps={DashBorardSteps} run={tourRun} continuous={true} showProgress={true} />
                <Tabs active_index={active_index} onTabItemClick={setActiveTabIndex} top>
                    {/* [Todo] needs to update tabs comIcDashBoardComponentsTabponent children instead of using label property */}
                    <div icon='IcDashboardComponentTab' label={localize('Dashboard')}>
                        <DashboardComponents />
                    </div>
                    <div icon='IcBotbuilderTabIcon' label='Bot Builder' id='id-bot-builder'>
                        <BotBuilder />
                    </div>
                    <div
                        icon='IcQuickStrategyIcon'
                        label='Quick Strategy'
                        id='id-quick-strategy'
                        onTabItemClick={handleClick}
                    />
                    <div icon='IcChartsTabDbot' label='Charts' id='id-charts'>
                        <div className='dashboard__chart-wrapper'>
                            <Chart />
                        </div>
                    </div>
                    <div icon='IcTutorialsTabs' label='Tutorial' id='id-tutorials'>
                        <div>Under Development</div>
                    </div>
                </Tabs>
            </div>
            <SideBar checkIfSidebarOpen={showSideBar} setSideBarState={setshowSideBar} />
        </div>
    );
};

export default Dashboard;
