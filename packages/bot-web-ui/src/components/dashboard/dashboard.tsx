import React from 'react';
import { Tabs, DesktopWrapper } from '@deriv/components';
import { localize } from '@deriv/translations';
import Chart from 'Components/chart';
import ReactJoyride from 'react-joyride';
import classNames from 'classnames';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';
import DashboardComponent from './dashboard-component';
import RunStrategy from './dashboard-component/run-strategy';
import RunPanel from '../run-panel';
import QuickStrategy from './quick-strategy';
import Tutorial from './tutorial-tab';
import {
    DBOT_ONBOARDING,
    handleJoyrideCallback,
    getTourSettings,
    setTourType,
    tour_type,
    setTourSettings,
} from './joyride-config';
import TourTriggrerDialog from './tour-trigger-dialog';

type TDashboard = {
    active_tab: number;
    is_drawer_open: boolean;
    setActiveTab: (active_tab: number) => void;
    onEntered: () => void;
    has_file_loaded: boolean;
    has_tour_started: boolean;
    has_onboard_tour_started: boolean;
    has_bot_builder_tour_started: boolean;
    setTourActive: (param: boolean) => void;
    setBotBuilderTourState: (param: boolean) => void;
    setOnBoardTourRunState: (param: boolean) => void;
    toggleStrategyModal: () => void;
    setTourDialogVisibility: (param: boolean) => void;
    setBotBuilderTokenCheck: (param: string | number) => void;
    setOnBoardingTokenCheck: (param: string | number) => void;
    is_tour_dialog_visible: boolean;
};

const Dashboard = ({
    active_tab,
    has_tour_started,
    has_file_loaded,
    has_onboard_tour_started,
    is_drawer_open,
    onEntered,
    setActiveTab,
    setTourActive,
    setOnBoardTourRunState,
    setBotBuilderTokenCheck,
    setBotBuilderTourState,
    setTourDialogVisibility,
    toggleStrategyModal,
    setOnBoardingTokenCheck,
    has_bot_builder_tour_started,
}: TDashboard) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        toggleStrategyModal();
    };

    let tour_status: { [key: string]: string };
    const setTourStatus = (param: { [key: string]: string }) => {
        if (tour_status) {
            const { action } = tour_status;
            const actions = ['skip', 'close'];

            if (actions.includes(action)) {
                if (tour_type.key === 'bot_builder_') {
                    setBotBuilderTourState(false);
                } else {
                    setOnBoardTourRunState(false);
                }
                setTourActive(false);
            }
        }
    };

    let getBotBuilderToken: string | number = '';
    let getOnboardingToken: string | number = '';

    React.useEffect(() => {
        if (active_tab === 0 && has_file_loaded) {
            onEntered();
        }
        if (active_tab === 0) {
            getOnboardingToken = getTourSettings('token');
            setOnBoardingTokenCheck(getOnboardingToken);
        }
        if (active_tab === 1 && !has_onboard_tour_started) {
            setTourType('bot_builder_');
            getBotBuilderToken = getTourSettings('token');
            setBotBuilderTokenCheck(getBotBuilderToken);
            setTourDialogVisibility(true);
        }

        tour_status = getTourSettings('onboard_tour_status');
        setTourStatus(tour_status);
    }, [active_tab, handleJoyrideCallback, has_onboard_tour_started]);

    //TODO: added addeventlistner because the useeffect does not trigger
    window.addEventListener('storage', () => {
        tour_status = getTourSettings('bot_builder_status');
        setTourStatus(tour_status);
        getBotBuilderToken = getTourSettings('token');
        if (active_tab === 1 && !storage.bot_builder_token && !has_onboard_tour_started) {
            setTourSettings(new Date().getTime(), `${tour_type.key}token`);
        }
    });
    const token = false;
    let storage = '';
    if (localStorage?.dbot_settings !== undefined) {
        storage = JSON.parse(localStorage?.dbot_settings);
    }

    const checkToken = () => {
        return (active_tab === 0 && !storage.onboard_tour_token) || (active_tab === 1 && !storage.bot_builder_token);
    };
    return (
        <React.Fragment>
            <div className='dashboard__main'>
                <div className='dashboard__container'>
                    {checkToken() && <TourTriggrerDialog />}
                    {has_tour_started && (
                        <ReactJoyride
                            steps={DBOT_ONBOARDING}
                            continuous
                            callback={handleJoyrideCallback}
                            spotlightClicks
                            locale={{ back: 'Previous' }}
                            styles={{
                                buttonBack: {
                                    border: '0.2rem solid var(--text-less-prominent)',
                                    marginRight: '1rem',
                                    borderRadius: '0.4rem',
                                    color: 'var(--general-section-7)',
                                    padding: '0.6rem',
                                },
                            }}
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
                    <RunStrategy />

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

export default connect(({ dashboard, quick_strategy, run_panel, load_modal }: RootStore) => ({
    active_tab: dashboard.active_tab,
    is_drawer_open: run_panel.is_drawer_open,
    is_tour_dialog_visible: dashboard.is_tour_dialog_visible,
    setActiveTab: dashboard.setActiveTab,
    toggleStrategyModal: quick_strategy.toggleStrategyModal,
    onEntered: load_modal.onEntered,
    has_bot_builder_tour_started: dashboard.has_bot_builder_tour_started,
    has_file_loaded: dashboard.has_file_loaded,
    has_onboard_tour_started: dashboard.has_onboard_tour_started,
    has_tour_started: dashboard.has_tour_started,
    setTourActive: dashboard.setTourActive,
    setOnBoardTourRunState: dashboard.setOnBoardTourRunState,
    setTourDialogVisibility: dashboard.setTourDialogVisibility,
    setBotBuilderTourState: dashboard.setBotBuilderTourState,
    setBotBuilderTokenCheck: dashboard.setBotBuilderTokenCheck,
    setOnBoardingTokenCheck: dashboard.setOnBoardingTokenCheck,
}))(Dashboard);
