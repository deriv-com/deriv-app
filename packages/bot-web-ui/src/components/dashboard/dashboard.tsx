import React from 'react';
import { Tabs, Icon, Tab } from '@deriv/components';
import { localize } from '@deriv/translations';
import Chart from 'Components/chart';
import DashboardComponents from './dashboard-components';
import SideBar from './dashboard-components/Sidebar';
import ReactJoyride from 'react-joyride';
import JoyrideConfig from './joyrideConfig';
import BotBuilder from './bot-builder';
import classNames from 'classnames';
import RunPanel from './run-panel';
import RunStretegy from '../toolbar/runStrategy.jsx';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';

interface DashboardProps {
    active_tab: number;
    setActiveTab: (active_tab: number) => void;
}

const Dashboard = ({ active_tab, setActiveTab }: DashboardProps) => {
    const [showSideBar, setshowSideBar] = React.useState<boolean>(true);
    const { DashBorardSteps } = JoyrideConfig;
    const [tourRun, setTourRun] = React.useState<boolean>(true);
    const handleClick = (e: any) => {
        e.preventDefault();
        setTourRun(true);
    };

    return (
        <div className='main_dashboard_container'>
            <div className={classNames('dashboard__container', { 'w-100': !showSideBar })}>
                <div className='dashboard__run-stretegy-wrapper'>
                    <RunStretegy />
                </div>
                <ReactJoyride steps={DashBorardSteps} run={tourRun} continuous={true} showProgress={true} />
                <Tabs active_index={active_tab} onTabItemClick={setActiveTab} top>
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
            <RunPanel />
        </div>
    );
};

export default connect((store: RootStore) => ({
    active_tab: store.dashbaord.active_tab,
    setActiveTab: store.dashbaord.setActiveTab,
}))(Dashboard);
