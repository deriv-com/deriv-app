import React from 'react';
import { Tabs } from '@deriv/components';
import { localize } from '@deriv/translations';
import Chart from 'Components/chart';
import DashboardComponent from './dashboard-component';
import ReactJoyride from 'react-joyride';
import { DBOT_ONBOARDING, handleJoyrideCallback, getJoyrideToken } from './joyride-config';
import classNames from 'classnames';
import RunStrategy from './dashboard-component/run-strategy';
import RunPanel from '../run-panel';
import QuickStrategy from './quick-strategy';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import Tutorial from './tutorial-tab';

type TDashboard = {
    active_tab: number;
    setActiveTab: (active_tab: number) => void;
    onEntered: () => void;
    has_file_loaded: boolean;
    toggleStrategyModal: () => void;
    is_drawer_open: boolean;
};

const Dashboard = ({
    active_tab,
    setActiveTab,
    toggleStrategyModal,
    onEntered,
    has_file_loaded,
    is_drawer_open,
}: TDashboard) => {
    const [show_side_bar, setShowSideBar] = React.useState<boolean>(true);
    const [tour_run, setTourRun] = React.useState<boolean>(true);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setTourRun(true);
        toggleStrategyModal();
    };

    const [joyride_Token, setJoyrideToken] = React.useState<string>('');
    React.useEffect(() => {
        setJoyrideToken(getJoyrideToken());
    }, [handleJoyrideCallback]);

    React.useEffect(() => {
        if (active_tab === 0 && has_file_loaded) {
            onEntered();
        }
    }, [active_tab]);
    return (
        <>
            <div className='dashboard__main'>
                <div className='dashboard__container'>
                    {/* {!joyride_Token && (
                       //TODO : Once the trigger button is implemented this check will be used
                    )} */}
                    <ReactJoyride
                        steps={DBOT_ONBOARDING}
                        run={tour_run}
                        continuous
                        spotlightClicks
                        callback={handleJoyrideCallback}
                    />
                    <Tabs active_index={active_tab} onTabItemClick={setActiveTab} top>
                        {/* [Todo] needs to update tabs comIcDashBoardComponentsTabponent children instead of using label property */}
                        <div icon='IcDashboardComponentTab' id='id-dashboard' label={localize('Dashboard')}>
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
                                    'quick-strategy__notifications-container--open': !is_drawer_open,
                                })}
                            >
                                <QuickStrategy />
                            </div>
                        </div>
                        <div icon='IcChartsTabDbot' label={localize('Charts')} id='id-charts'>
                            <div className='dashboard__chart-wrapper'>
                                <Chart />
                            </div>
                        </div>
                        <div icon='IcTutorialsTabs' label={localize('Tutorial')} id='id-tutorials'>
                            <div className='tutorials-wrapper'>
                                <Tutorial />
                            </div>
                        </div>
                    </Tabs>
                </div>
            </div>
            <div className='dashboard__run-strategy-wrapper'>
                <RunStrategy />
                {/*
                    1. Bot-Builder
                    2. Quick Strategy
                    3. Charts
                */}
                {[1, 2, 3].includes(active_tab) && <RunPanel />}
            </div>
        </>
    );
};

export default connect(({ dashboard, quick_strategy, run_panel, load_modal }: RootStore) => ({
    active_tab: dashboard.active_tab,
    setActiveTab: dashboard.setActiveTab,
    toggleStrategyModal: quick_strategy.toggleStrategyModal,
    is_drawer_open: run_panel.is_drawer_open,
    onEntered: load_modal.onEntered,
    has_file_loaded: dashboard.has_file_loaded,
}))(Dashboard);
