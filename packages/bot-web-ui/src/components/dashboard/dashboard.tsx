import React from 'react';
import { Tabs } from '@deriv/components';
import { localize } from '@deriv/translations';
import Chart from 'Components/chart';
import DashboardComponent from './dashboard-component';
import ReactJoyride from 'react-joyride';
import { dbot_onboarding } from './joyride-config';
import RunStrategy from './dashboard-component/run-strategy';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import RunPanel from '../run-panel';
import QuickStrategy from './quick-strategy';
import classNames from 'classnames';
import Tutorial from './tutorial-tab';
import { isMobile } from '@deriv/shared';

type TDashboard = {
    active_tab: number;
    setActiveTab: (active_tab: number) => void;
    toggleStrategyModal: () => void;
    is_drawer_open: boolean;
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
                    <ReactJoyride steps={dbot_onboarding} run={tour_run} continuous={true} showProgress={true} />
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
                                    'quick-strategy__notifications-container--open': !is_drawer_open,
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
            {!isMobile() && (
                <div className='dashboard__run-strategy-wrapper'>
                    <RunStrategy />
                    {/*
                    1. Bot-Builder
                    2. Quick Strategy
                    3. Charts
                */}
                    {[1, 2, 3].includes(active_tab) && <RunPanel />}
                </div>
            )}
        </React.Fragment>
    );
};

export default connect(({ dashboard, quick_strategy, run_panel }: RootStore) => ({
    active_tab: dashboard.active_tab,
    setActiveTab: dashboard.setActiveTab,
    toggleStrategyModal: quick_strategy.toggleStrategyModal,
    is_drawer_open: run_panel.is_drawer_open,
}))(Dashboard);
