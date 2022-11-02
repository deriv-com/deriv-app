import React from 'react';
import { Tabs, DesktopWrapper } from '@deriv/components';
import { localize } from '@deriv/translations';
import Chart from 'Components/chart';
import ReactJoyride from 'react-joyride';
import { DBOT_ONBOARDING, handleJoyrideCallback, getTourSettings } from './joyride-config';
import classNames from 'classnames';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import DashboardComponent from './dashboard-component';
import RunStrategy from './dashboard-component/run-strategy';
import RunPanel from '../run-panel';
import QuickStrategy from './quick-strategy';
import Tutorial from './tutorial-tab';
import TourTriggrerDialog from './tour-trigger-dialog';

type TDashboard = {
    active_tab: number;
    is_drawer_open: boolean;
    setActiveTab: (active_tab: number) => void;
    onEntered: () => void;
    has_file_loaded: boolean;
    has_tour_started: boolean;
    has_onboard_tour_started: boolean;
    setTourActive: (param: boolean) => void;
    setOnBoardTourRunState: (param: boolean) => void;
    toggleStrategyModal: () => void;
    is_mobile: boolean;
};

const Dashboard = ({
    active_tab,
    setActiveTab,
    toggleStrategyModal,
    onEntered,
    setTourActive,
    has_tour_started,
    has_file_loaded,
    is_drawer_open,
    setOnBoardTourRunState,
    is_mobile,
}: TDashboard) => {
    const [show_side_bar, setShowSideBar] = React.useState<boolean>(true);
    const [is_tour_running, setTourRun] = React.useState<boolean>(true);
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setTourRun(true);
        toggleStrategyModal();
    };

    React.useEffect(() => {
        if (active_tab === 0 && has_file_loaded) {
            onEntered();
        }
        const tour_status = getTourSettings('status');

        if (tour_status) {
            const { action } = tour_status;
            const actions = ['skip', 'close', 'reset'];
            if (actions.includes(action)) {
                setOnBoardTourRunState(false);
                setTourActive(false);
            }
        }
    }, [active_tab, handleJoyrideCallback]);
    return (
        <React.Fragment>
            <div className='dashboard__main'>
                <div className='dashboard__container'>
                    <TourTriggrerDialog />
                    {has_tour_started && (
                        <ReactJoyride
                            steps={DBOT_ONBOARDING}
                            run={is_tour_running}
                            continuous
                            callback={handleJoyrideCallback}
                            spotlightClicks
                        />
                    )}
                    <Tabs active_index={active_tab} className='dashboard__tabs' onTabItemClick={setActiveTab} top>
                        <div icon='IcDashboardComponentTab' label={localize('Dashboard')}>
                            <DashboardComponent />
                        </div>
                        <div icon='IcBotBuilderTabIcon' label={localize('Bot Builder')} id='id-bot-builder' />
                        <div
                            icon='IcQuickStrategyIcon'
                            label={localize('Quick Strategy')}
                            id='id-quick-strategy'
                            onClick={handleClick}
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
                    {!(is_mobile && active_tab === 2) && <RunStrategy />}

                    {/*
                        TODO: need to add named tab index such as 'dashboard', 'charts' etc
                        instead of using default index 0, 1, 2
                        
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

export default connect(({ dashboard, quick_strategy, run_panel, load_modal, ui }: RootStore) => ({
    active_tab: dashboard.active_tab,
    is_drawer_open: run_panel.is_drawer_open,
    setActiveTab: dashboard.setActiveTab,
    toggleStrategyModal: quick_strategy.toggleStrategyModal,
    onEntered: load_modal.onEntered,
    has_file_loaded: dashboard.has_file_loaded,
    has_tour_started: dashboard.has_tour_started,
    setTourActive: dashboard.setTourActive,
    setOnBoardTourRunState: dashboard.setOnBoardTourRunState,
    is_mobile: ui.is_mobile,
}))(Dashboard);
