import React from 'react';
import RootStore from 'Stores/index';
import AppStore from 'Stores/app-store';
import { connect } from 'Stores/connect';
import ReactJoyride from 'react-joyride';
import classNames from 'classnames';
import LoadModal from 'Components/load-modal';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';
import SaveModal from 'Components/save-modal';
import WorkspaceWrapper from './workspace-wrapper';
import { BOT_BUILDER_TOUR, handleJoyrideCallback } from '../joyride-config';
import TourSlider from '../tour-slider';
import { setColors } from '../../../../../bot-skeleton/src/scratch/hooks/colours';
import { DBot } from '@deriv/bot-skeleton';
import { blocksCoordinate } from '../../../../../bot-skeleton/src/scratch/hooks/block_svg';

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
    is_dark_mode_on,
    selected_strategy_id,
    loadFileFromRecent,
    previewRecentStrategy,
}: TBotBuilder) => {
    const [is_tour_running] = React.useState<boolean>(true);
    const { onMount, onUnmount } = app;
    const el_ref = React.useRef<HTMLInputElement | null>(null);
    React.useEffect(() => {
        setTimeout(() => {
            previewRecentStrategy(selected_strategy_id);
        }, 0); // made this async to give it a split second delay
        if (active_tab === 1) {
            setColors(is_dark_mode_on);
            setTimeout(() => {
                loadFileFromRecent();
            }, 100);
        }
    }, [is_dark_mode_on, active_tab]);

    React.useEffect(() => {
        onMount();
        return () => onUnmount();
    }, []);

    React.useEffect(() => {
        if (active_tab === 1) blocksCoordinate();
    }, [active_tab]);

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
                        <ReactJoyride
                            steps={BOT_BUILDER_TOUR}
                            run={is_tour_running}
                            continuous
                            showProgress
                            callback={handleJoyrideCallback}
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
                                    border: '0.1rem solid var(--text-less-prominent)',
                                    marginRight: '1rem',
                                    borderRadius: '0.4rem',
                                    color: 'var(--text-general)',
                                    padding: '0.6rem',
                                },
                                tooltipContent: {
                                    padding: '0 1rem',
                                },
                            }}
                        />
                    </DesktopWrapper>
                </>
            )}
            {/* removed this outside from toolbar becuase it needs to loaded seperately without dependency */}
            <LoadModal />
            <SaveModal />
        </>
    );
};

export default connect(({ app, dashboard, load_modal, ui }: RootStore) => ({
    app,
    active_tab: dashboard.active_tab,
    has_started_onboarding_tour: dashboard.has_started_onboarding_tour,
    has_started_bot_builder_tour: dashboard.has_started_bot_builder_tour,
    is_preview_on_popup: dashboard.is_preview_on_popup,
    is_dark_mode_on: ui.is_dark_mode_on,
    loadFileFromRecent: load_modal.loadFileFromRecent,
    setOnBoardTourRunState: dashboard.setOnBoardTourRunState,
    previewRecentStrategy: load_modal.previewRecentStrategy,
    selected_strategy_id: load_modal.selected_strategy_id,
}))(BotBuilder);
