import React from 'react';
import { Tabs, DesktopWrapper, Dialog, MobileWrapper, Collapsible } from '@deriv/components';
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
    tour_status_ended,
} from './joyride-config';
import TourTriggrerDialog from './tour-trigger-dialog';
import { getImageLocation } from '../../public-path';

type TDialogOptions = {
    title: string;
    message: string;
    cancel_button_text?: string;
    ok_button_text?: string;
};

type TDashboard = {
    active_tab: number;
    dialog_options: TDialogOptions;
    has_started_bot_builder_tour: boolean;
    has_file_loaded: boolean;
    has_started_onboarding_tour: boolean;
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
    setHasTourEnded: (param: boolean) => void;
};

type Props = {
    collapsible: boolean;
};
type TDiv = Props & React.HTMLAttributes<HTMLDivElement>;

const ExtendedDiv = ({ collapsible, ...props }: TDiv) => <div {...props}>{props.children}</div>;

const Dashboard = ({
    active_tab,
    is_drawer_open,
    dialog_options,
    has_file_loaded,
    has_tour_started,
    has_started_onboarding_tour,
    has_started_bot_builder_tour,
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
    setHasTourEnded,
}: TDashboard) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        loadDataStrategy();
    };

    const { BOT_BUILDER, CHART, QUICK_STRATEGY } = DASHBOARD_TABS;
    const is_tour_complete = React.useRef(true);
    let bot_tour_token: string | number = '';
    let onboard_tour_token: string | number = '';
    let storage = '';
    let tour_status: { [key: string]: string };
    const setTourStatus = (param: { [key: string]: string }) => {
        if (tour_status) {
            const { action } = tour_status;
            const actions = ['skip', 'close'];

            if (actions.includes(action)) {
                if (tour_type.key === 'bot_builder') {
                    setBotBuilderTourState(false);
                } else {
                    setOnBoardTourRunState(false);
                }
                setTourActive(false);
            }
        }
    };

    React.useEffect(() => {
        if (active_tab === 0 && has_file_loaded) {
            onEntered();
        }
        if (active_tab === 0) {
            setTourType('onboard_tour');
            onboard_tour_token = getTourSettings('token');
            setOnBoardingTokenCheck(onboard_tour_token);
        }
        if (active_tab === 1 && !has_started_onboarding_tour) {
            setTourType('bot_builder');
            bot_tour_token = getTourSettings('token');
            setBotBuilderTokenCheck(bot_tour_token);
        }
        tour_status = getTourSettings('onboard_tour_status');
        setTourStatus(tour_status);
    }, [active_tab, handleJoyrideCallback, has_started_onboarding_tour, tour_status_ended]);

    const botStorageSetting = () => {
        tour_status = getTourSettings('bot_builder_status');
        setTourStatus(tour_status);
        if (tour_status_ended.key === 'finished') {
            if (tour_type.key === 'onboard_tour') {
                setActiveTab(0);
                setTourDialogVisibility(true);
            } else {
                setTourDialogVisibility(true);
            }
            setHasTourEnded(true);
            is_tour_complete.current = false;
            window.removeEventListener('storage', botStorageSetting);
        }

        bot_tour_token = getTourSettings('token');
        if (active_tab === 1 && !storage.bot_builder_token && !has_started_onboarding_tour) {
            setTourSettings(new Date().getTime(), `${tour_type.key}_token`);
        }
    };
    if (!bot_tour_token) {
        setHasTourEnded(false);
        window.addEventListener('storage', botStorageSetting);
    }

    if (localStorage?.dbot_settings !== undefined) {
        storage = JSON.parse(localStorage?.dbot_settings);
    }

    React.useEffect(() => {
        const dbot_settings = JSON.parse(localStorage.getItem('dbot_settings') as string);
        if (
            (active_tab === 0 && !dbot_settings?.onboard_tour_token) ||
            (active_tab === 1 && !dbot_settings?.bot_builder_token && !has_started_onboarding_tour)
        ) {
            setTourDialogVisibility(true);
        }
    }, [active_tab]);

    React.useEffect(() => {
        const images = [
            getImageLocation('ic-new-user-step-two.png'),
            getImageLocation('ic-new-user-step-three.png'),
            getImageLocation('ic-new-user-step-four.png'),
            getImageLocation('ic-new-user-step-five.png'),
            getImageLocation('ic-new-user-step-six.png'),
            getImageLocation('ic-new-user-step-seven.png'),
        ];

        images.forEach(img => {
            if (!document.getElementById(img)) {
                const link = document.createElement('link');
                link.setAttribute('rel', 'preload');
                link.setAttribute('as', 'image');
                link.setAttribute('href', img);
                link.setAttribute('id', img);
                document.getElementsByTagName('head')[0].appendChild(link);
            }
        });
    }, [has_tour_started]);

    return (
        <React.Fragment>
            <div className='dashboard__main'>
                <div className='dashboard__container'>
                    <TourTriggrerDialog />
                    {has_tour_started && (
                        <ReactJoyride
                            steps={DBOT_ONBOARDING}
                            continuous
                            callback={handleJoyrideCallback}
                            spotlightClicks
                            hideCloseButton
                            locale={{ back: 'Previous' }}
                            styles={{
                                options: {
                                    arrowColor: 'var(--general-main-2)',
                                    backgroundColor: 'var(--general-main-2)',
                                    primaryColor: 'var(--brand-red-coral)',
                                    textColor: 'var(--text-general)',
                                    spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
                                },
                                buttonBack: {
                                    border: '0.2rem solid var(--text-less-prominent)',
                                    marginRight: '1rem',
                                    borderRadius: '0.4rem',
                                    color: 'var(--text-general)',
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
                        <div icon='IcDashboardComponentTab' label={localize('Dashboard')} id='id-dbot-dashboard'>
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
                            {active_tab !== 2 && (
                                <MobileWrapper>
                                    <div className='mobile-wrapper'>
                                        <Collapsible position='top' is_collapsed={false} as='div'>
                                            <ExtendedDiv className='dashboard__run-strategy-wrapper' collapsible>
                                                <RunStrategy />
                                            </ExtendedDiv>
                                        </Collapsible>
                                    </div>
                                    {/* // TODO: implement Performance panel as per new design
                                        {([BOT_BUILDER, CHART, QUICK_STRATEGY].includes(active_tab) || has_started_onboarding_tour) && (
                                        <RunPanel />
                                    )} */}
                                </MobileWrapper>
                            )}
                        </div>
                        <div icon='IcTutorialsTabs' label={localize('Tutorials')} id='id-tutorials'>
                            <div className='tutorials-wrapper'>
                                <Tutorial />
                            </div>
                        </div>
                    </Tabs>
                </div>
            </div>
            <DesktopWrapper>
                <div className='dashboard__run-strategy-wrapper'>
                    {active_tab !== 2 && <RunStrategy />}

                    {([BOT_BUILDER, CHART, QUICK_STRATEGY].includes(active_tab) || has_started_onboarding_tour) &&
                        !has_started_bot_builder_tour && <RunPanel />}
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
    setTourActive: dashboard.setTourActive,
    has_started_onboarding_tour: dashboard.has_started_onboarding_tour,
    setOnBoardTourRunState: dashboard.setOnBoardTourRunState,
    setTourDialogVisibility: dashboard.setTourDialogVisibility,
    setBotBuilderTourState: dashboard.setBotBuilderTourState,
    onEntered: load_modal.onEntered,
    setHasTourEnded: dashboard.setHasTourEnded,
    is_dialog_open: run_panel.is_dialog_open,
    is_drawer_open: run_panel.is_drawer_open,
    has_started_bot_builder_tour: dashboard.has_started_bot_builder_tour,
    is_tour_dialog_visible: dashboard.is_tour_dialog_visible,
    loadDataStrategy: quick_strategy.loadDataStrategy,
    dialog_options: run_panel.dialog_options,
    onCancelButtonClick: run_panel.onCancelButtonClick,
    onCloseDialog: run_panel.onCloseDialog,
    onOkButtonClick: run_panel.onOkButtonClick,
    setActiveTab: dashboard.setActiveTab,
    setBotBuilderTokenCheck: dashboard.setBotBuilderTokenCheck,
    setOnBoardingTokenCheck: dashboard.setOnBoardingTokenCheck,
}))(Dashboard);
