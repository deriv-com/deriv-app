import React from 'react';
import { Tabs, Tab } from '@deriv/components';
import { localize } from '@deriv/translations';
import Chart from 'Components/chart';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';
import classNames from 'classnames';
import ReactJoyride from 'react-joyride';
import DashboardComponents from './dashboard-components';
import { DBOT_ONBOARDING } from './joyride-config';
import BotBuilder from './bot-builder';
import RunStrategy from '../toolbar/run-strategy';
import Sidebar from './dashboard-components/sidebar';
import RunPanel from '../run-panel';

interface DashboardProps {
    active_tab: number;
    setActiveTab: (active_tab: number) => void;
}

const Dashboard = ({ active_tab, setActiveTab }: DashboardProps) => {
    const [show_side_bar, setShowSideBar] = React.useState<boolean>(true);
    const [tour_run, setTourRun] = React.useState<boolean>(true);
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setTourRun(true);
    };

    return (
        <div className='dashboard__main'>
            <div className={classNames('dashboard__container', { 'w-100': !show_side_bar })}>
                <ReactJoyride steps={DBOT_ONBOARDING} run={tour_run} continuous={true} showProgress={true} />
                <Tabs active_index={active_tab} onTabItemClick={setActiveTab} top>
                    {/* [Todo] needs to update tabs comIcDashBoardComponentsTabponent children instead of using label property */}
                    <Tab icon='IcDashboardComponentTab' label={localize('Dashboard')}>
                        <DashboardComponents />
                    </Tab>
                    <Tab icon='IcBotbuilderTabIcon' label={localize('Bot Builder')} id='id-bot-builder'>
                        <BotBuilder />
                    </Tab>
                    <Tab
                        icon='IcQuickStrategyIcon'
                        label={localize('Quick Strategy')}
                        id='id-quick-strategy'
                        onTabItemClick={handleClick}
                    />
                    <Tab icon='IcChartsTabDbot' label={localize('Charts')} id='id-charts'>
                        <div className='dashboard__chart-wrapper'>
                            <Chart />
                        </div>
                    </Tab>
                    <Tab icon='IcTutorialsTabs' label={localize('Tutorial')} id='id-tutorials'>
                        <div>{localize('Under Developments')}</div>
                    </Tab>
                </Tabs>
            </div>

            <div
                className={classNames('dashboard__run-strategy-wrapper', {
                    'dashboard__sidebar-wrapper--active': !show_side_bar || active_tab !== 0,
                })}
            >
                <RunStrategy />
                {active_tab === 0 && <Sidebar is_sidebar_open={show_side_bar} setSideBarState={setShowSideBar} />}
                {(active_tab === 1 || active_tab === 2) && <RunPanel />}
            </div>
        </div>
    );
};

export default connect((store: RootStore) => ({
    active_tab: store.dashbaord.active_tab,
    setActiveTab: store.dashbaord.setActiveTab,
}))(Dashboard);
