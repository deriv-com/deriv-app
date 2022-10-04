import React from 'react';
import { Tabs, Tab } from '@deriv/components';
import { localize } from '@deriv/translations';
import Chart from 'Components/chart';
import DashboardComponents from './dashboard-components';
import ReactJoyride from 'react-joyride';
import { DBOT_ONBOARDING, handleJoyrideCallback, getJoyrideToken } from './joyride-config';
import BotBuilder from './bot-builder';
import classNames from 'classnames';
import RunStrategy from './dashboard-components/run-strategy';
import Sidebar from './dashboard-components/sidebar';
import RunPanel from '../run-panel';
import Tutorial from './tutorial-tab';
import QuickStrategy from './quick-strategy';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';

interface DashboardProps {
    active_tab: number;
    setActiveTab: (active_tab: number) => void;
    onEntered: () => void;
    has_file_loaded: boolean;
    toggleStrategyModal: () => void;
    is_drawer_open: boolean;
}

const Dashboard = ({
    active_tab,
    setActiveTab,
    toggleStrategyModal,
    onEntered,
    has_file_loaded,
    is_drawer_open,
}: DashboardProps) => {
    const [show_side_bar, setShowSideBar] = React.useState<boolean>(true);
    const [tour_run, setTourRun] = React.useState<boolean>(true);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setTourRun(true);
        toggleStrategyModal();
    };

    const [getJoyrideTokenData, setJoyrideTokenData] = React.useState<string>('');
    React.useEffect(() => {
        setJoyrideTokenData(getJoyrideToken());
    }, [handleJoyrideCallback]);

    React.useEffect(() => {
        if (active_tab === 0 && has_file_loaded) {
            onEntered();
        }
    }, [active_tab]);
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
                    >
                        <div
                            className={classNames('quick-strategy', {
                                'quick-strategy__notifications-container--open': !is_drawer_open,
                            })}
                        >
                            <QuickStrategy />
                        </div>
                    </Tab>
                    <Tab icon='IcChartsTabDbot' label={localize('Charts')} id='id-charts'>
                        <div className='dashboard__chart-wrapper'>
                            <Chart />
                        </div>
                    </Tab>
                    <Tab icon='IcTutorialsTabs' label={localize('Tutorial')} id='id-tutorials'>
                        <div>
                            <Tutorial />
                        </div>
                    </Tab>
                </Tabs>
            </div>

            <div
                className={classNames('dashboard__run-strategy-wrapper', {
                    'dashboard__sidebar-wrapper--active': active_tab !== 0 || !show_side_bar,
                })}
            >
                <RunStrategy />
                {active_tab === 0 && <Sidebar is_sidebar_open={show_side_bar} setSideBarState={setShowSideBar} />}
                {(active_tab !== 0 || !show_side_bar) && <RunPanel />}
            </div>
        </div>
    );
};

export default connect(({ dashbaord, load_modal }: RootStore) => ({
    active_tab: dashbaord.active_tab,
    setActiveTab: dashbaord.setActiveTab,
    onEntered: load_modal.onEntered,
    has_file_loaded: dashbaord.has_file_loaded,
}))(Dashboard);
