import React from 'react';
import classNames from 'classnames';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';
import LoadModal from 'Components/load-modal';
import SaveModal from 'Components/save-modal';
import ReactJoyrideWrapper from '../react-joyride-wrapper';
import AppStore from 'Stores/app-store';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { BOT_BUILDER_TOUR } from '../joyride-config';
import QuickStrategy from '../quick-strategy';
import TourSlider from '../tour-slider';
import WorkspaceWrapper from './workspace-wrapper';

type TBotBuilder = {
    app: AppStore;
    active_tab: number;
    has_started_onboarding_tour: boolean;
    has_started_bot_builder_tour: boolean;
    is_preview_on_popup: boolean;
    is_dark_mode_on: boolean;
    setOnBoardTourRunState: (has_started_onboarding_tour: boolean) => boolean;
    loadFileFromRecent: () => void;
    selected_strategy_id: string;
    previewRecentStrategy: (selected_strategy_id: string) => void;
};

const BotBuilder = ({
    app,
    active_tab,
    has_started_onboarding_tour,
    has_started_bot_builder_tour,
    is_preview_on_popup,
}: TBotBuilder) => {
    const [is_tour_running] = React.useState<boolean>(true);
    const { onMount, onUnmount } = app;
    const el_ref = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        onMount();
        return () => onUnmount();
    }, []);

    return (
        <>
            <div
                className={classNames('bot-builder', {
                    'bot-builder--active': active_tab === 1 && !is_preview_on_popup,
                    'bot-builder--inactive': is_preview_on_popup,
                    'bot-builder--tour-active': has_started_bot_builder_tour,
                })}
            >
                {is_preview_on_popup ? null : (
                    <div
                        id='scratch_div'
                        ref={el_ref}
                        style={{
                            width: 'calc(100vw - 3.2rem)',
                            height: 'var(--bot-content-height)',
                        }}
                    >
                        <WorkspaceWrapper />
                    </div>
                )}
            </div>
            {has_started_bot_builder_tour && active_tab === 1 && !has_started_onboarding_tour && (
                <>
                    <MobileWrapper>
                        <TourSlider />
                    </MobileWrapper>
                    <DesktopWrapper>
                        <ReactJoyrideWrapper
                            steps={BOT_BUILDER_TOUR}
                            run={is_tour_running}
                            showProgress
                            styles={{
                                options: {
                                    arrowColor: 'transparent',
                                    backgroundColor: 'var(--general-main-2)',
                                    primaryColor: 'var(--brand-red-coral)',
                                    textColor: 'var(--text-general)',
                                },
                            }}
                        />
                    </DesktopWrapper>
                </>
            )}
            {/* removed this outside from toolbar becuase it needs to loaded seperately without dependency */}
            <LoadModal />
            <SaveModal />
            <QuickStrategy />
        </>
    );
};

export default connect(({ app, dashboard }: RootStore) => ({
    app,
    active_tab: dashboard.active_tab,
    has_started_onboarding_tour: dashboard.has_started_onboarding_tour,
    has_started_bot_builder_tour: dashboard.has_started_bot_builder_tour,
    is_preview_on_popup: dashboard.is_preview_on_popup,
    setOnBoardTourRunState: dashboard.setOnBoardTourRunState,
}))(BotBuilder);
