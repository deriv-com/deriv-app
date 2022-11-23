import React from 'react';
import { Tabs, DesktopWrapper, Dialog } from '@deriv/components';
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
import { DASHBOARD_TABS } from '../../constants/bot-contents';
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
import { isMobile } from '@deriv/shared';

type TDialogOptions = {
    title: string;
    message: string;
    cancel_button_text?: string;
    ok_button_text?: string;
};

type TDashboard = {
    active_tab: number;
    dialog_options: TDialogOptions;
    has_bot_builder_tour_started: boolean;
    has_file_loaded: boolean;
    has_onboard_tour_started: boolean;
    has_tour_started: boolean;
    is_dialog_open: boolean;
    is_drawer_open: boolean;
    is_tour_dialog_visible: boolean;
    onCancelButtonClick: () => void;
    onCloseDialog: () => void;
    onEntered: () => void;
    onOkButtonClick: () => void;
    setActiveTab: (active_tab: number) => void;
    setBotBuilderTourState: (param: boolean) => void;
    setOnBoardTourRunState: (param: boolean) => void;
    loadDataStrategy: () => void;
    setBotBuilderTokenCheck: (param: string | number) => void;
    setOnBoardingTokenCheck: (param: string | number) => void;
    setTourActive: (param: boolean) => void;
    setTourDialogVisibility: (param: boolean) => void;
    toggleStrategyModal: () => void;
};

const Dashboard = ({
    active_tab,
    is_drawer_open,
    dialog_options,
    has_file_loaded,
    has_tour_started,
    has_onboard_tour_started,
    is_dialog_open,
    loadDataStrategy,
    onCancelButtonClick,
    onCloseDialog,
    onEntered,
    onOkButtonClick,
    setActiveTab,
    setBotBuilderTokenCheck,
    setBotBuilderTourState,
    setOnBoardingTokenCheck,
    setOnBoardTourRunState,
    setTourActive,
    setTourDialogVisibility,
}: TDashboard) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        loadDataStrategy();
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
    let storage = '';
    if (localStorage?.dbot_settings !== undefined) {
        storage = JSON.parse(localStorage?.dbot_settings);
    }

    const { BOT_BUILDER, CHART, QUICK_STRATEGY } = DASHBOARD_TABS;

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
                    <Tabs
                        active_index={active_tab}
                        className='dashboard__tabs'
                        onTabItemChange={onEntered}
                        onTabItemClick={setActiveTab}
                        top
                    >
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
                                    'quick-strategy--open': is_drawer_open,
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
                    {!(isMobile() && active_tab === 2) && <RunStrategy />}

                    {[BOT_BUILDER, CHART, QUICK_STRATEGY].includes(active_tab) && <RunPanel />}
                </div>
            </DesktopWrapper>
            <Dialog
                cancel_button_text={dialog_options.cancel_button_text || localize('Cancel')}
                className={'dc-dialog__wrapper--fixed'}
                confirm_button_text={dialog_options.ok_button_text || localize('OK')}
                has_close_icon
                is_mobile_full_width={false}
                is_visible={is_dialog_open}
                onCancel={onCancelButtonClick}
                onClose={onCloseDialog}
                onConfirm={onOkButtonClick || onCloseDialog}
                portal_element_id='modal_root'
                title={dialog_options.title}
            >
                {dialog_options.message}
            </Dialog>
        </React.Fragment>
    );
};

export default connect(({ dashboard, quick_strategy, run_panel, load_modal, ui }: RootStore) => ({
    active_tab: dashboard.active_tab,
    has_file_loaded: dashboard.has_file_loaded,
    has_tour_started: dashboard.has_tour_started,
    has_bot_builder_tour_started: dashboard.has_bot_builder_tour_started,
    is_tour_dialog_visible: dashboard.is_tour_dialog_visible,
    setActiveTab: dashboard.setActiveTab,
    setTourActive: dashboard.setTourActive,
    setOnBoardTourRunState: dashboard.setOnBoardTourRunState,
    setBotBuilderTourState: dashboard.setBotBuilderTourState,
    setBotBuilderTokenCheck: dashboard.setBotBuilderTokenCheck,
    setOnBoardingTokenCheck: dashboard.setOnBoardingTokenCheck,
    setTourDialogVisibility: dashboard.setTourDialogVisibility,
    loadDataStrategy: quick_strategy.loadDataStrategy,
    is_drawer_open: run_panel.is_drawer_open,
    dialog_options: run_panel.dialog_options,
    is_dialog_open: run_panel.is_dialog_open,
    onCancelButtonClick: run_panel.onCancelButtonClick,
    onCloseDialog: run_panel.onCloseDialog,
    onOkButtonClick: run_panel.onOkButtonClick,
    onEntered: load_modal.onEntered,
}))(Dashboard);
