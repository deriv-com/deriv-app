import React from 'react';
import { Tabs, DesktopWrapper } from '@deriv/components';
import { localize } from '@deriv/translations';
import Chart from 'Components/chart';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';
import classNames from 'classnames';
import ReactJoyride from 'react-joyride';
import DashboardComponent from './dashboard-component';
import { DBOT_ONBOARDING } from './joyride-config';
import RunStrategy from './dashboard-component/run-strategy';
import RunPanel from '../run-panel';
import QuickStrategy from './quick-strategy';
import Tutorial from './tutorial-tab';

type TDashboard = {
    active_tab: number;
    is_drawer_open: boolean;
    setActiveTab: (active_tab: number) => void;
    toggleStrategyModal: () => void;
};

const Dashboard = ({ active_tab, setActiveTab, toggleStrategyModal, is_drawer_open }: TDashboard) => {
    const [tour_run, setTourRun] = React.useState<boolean>(true);
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setTourRun(true);
        toggleStrategyModal();
    };

    return (
        <React.Fragment>
            <div className='dashboard__main'>
                <div className='dashboard__container'>
                    <ReactJoyride steps={DBOT_ONBOARDING} run={tour_run} continuous showProgress />
                    <Tabs active_index={active_tab} onTabItemClick={setActiveTab} top>
                        {/* TODO: needs to update tabs comIcDashBoardComponentsTabponent children instead of using label property */}
                        <div icon='IcDashboardComponentTab' label={localize('Dashboard')}>
                            <DashboardComponent />
                        </div>
                        <div icon='IcBotBuilderTabIcon' label={localize('Bot Builder')} id='id-bot-builder' />
                        <div
                            icon='IcQuickStrategyIcon'
                            label={localize('Quick Strategy')}
                            id='id-quick-strategy'
                            onTabItemClick={handleClick}
                        >
                            <div
                                className={classNames('quick-strategy', {
                                    'quick-strategy__notifications-container--open': is_drawer_open,
                                    'quick-strategy__notifications-container--closed': !is_drawer_open,
                                })}
                            >
                                <QuickStrategy />
                            </div>
                        </div>
                        <div icon='IcChartsTabDbot' label={localize('Charts')} id='id-charts'>
                            <Chart />
                        </div>
                        <div icon='IcTutorialsTabs' label={localize('Tutorial')} id='id-tutorials'>
                            <div className='tutorials-wrapper'>
                                <Tutorial />
                            </div>
                        </div>
                    </Tabs>
                </div>
            </div>
            <DesktopWrapper>
                <div className='dashboard__run-strategy-wrapper'>
                    <RunStrategy />
                    {/*
                        1. Bot-Builder
                        2. Quick Strategy
                        3. Charts
                    */}
                    {[1, 2, 3].includes(active_tab) && <RunPanel />}
                </div>
            </DesktopWrapper>
        </React.Fragment>
    );
};

export default connect(({ dashboard, quick_strategy, run_panel }: RootStore) => ({
    active_tab: dashboard.active_tab,
    is_drawer_open: run_panel.is_drawer_open,
    setActiveTab: dashboard.setActiveTab,
    toggleStrategyModal: quick_strategy.toggleStrategyModal,
}))(Dashboard);
