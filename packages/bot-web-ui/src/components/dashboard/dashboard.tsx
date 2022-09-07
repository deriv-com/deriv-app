import React from 'react';
import { Tabs, Tab } from '@deriv/components';
import { localize } from '@deriv/translations';
import Chart from 'Components/chart';
import DashboardComponents from './dashboard-components';
import ReactJoyride from 'react-joyride';
import JoyrideConfig from './joyrideConfig';
import BotBuilder from './bot-builder';
import classNames from 'classnames';
import RunStretegy from '../toolbar/runStrategy';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import Sidebar from './dashboard-components/sidebar';

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
                    <Tab icon='IcDashboardComponentTab' label={localize('Dashboard')}>
                        <DashboardComponents />
                    </Tab>
                    <Tab icon='IcBotbuilderTabIcon' label='Bot Builder' id='id-bot-builder'>
                        <BotBuilder />
                    </Tab>
                    <Tab
                        icon='IcQuickStrategyIcon'
                        label='Quick Strategy'
                        id='id-quick-strategy'
                        onTabItemClick={handleClick}
                    />
                    <Tab icon='IcChartsTabDbot' label='Charts' id='id-charts'>
                        <div className='dashboard__chart-wrapper'>
                            <Chart />
                        </div>
                    </Tab>
                    <Tab icon='IcTutorialsTabs' label='Tutorial' id='id-tutorials'>
                        <div>Under Development</div>
                    </Tab>
                </Tabs>
            </div>
            <Sidebar checkIfSidebarOpen={showSideBar} setSideBarState={setshowSideBar} />
        </div>
    );
};

export default connect((store: RootStore) => ({
    active_tab: store.dashbaord.active_tab,
    setActiveTab: store.dashbaord.setActiveTab,
}))(Dashboard);
