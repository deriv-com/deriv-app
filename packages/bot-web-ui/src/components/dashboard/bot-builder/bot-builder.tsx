import React from 'react';
import RootStore from 'Stores/index';
import AppStore from 'Stores/app-store';
import { connect } from 'Stores/connect';
import ReactJoyride from 'react-joyride';
import classNames from 'classnames';
import WorkspaceWrapper from './workspace-wrapper';
import { BOT_BUILDER_TOUR } from '../joyride-config';
import LoadModal from 'Components/load-modal';

type TBotBuilder = {
    app: AppStore;
    active_tab: number;
    onboard_tour_run_state: boolean;
    is_preview_on_popup: boolean;
    setOnBoardTourRunState: (onboard_tour_run_state: boolean) => boolean;
};

const BotBuilder = ({ app, active_tab, onboard_tour_run_state, is_preview_on_popup }: TBotBuilder) => {
    const { onMount, onUnmount } = app;

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
                })}
            >
                {is_preview_on_popup ? null : (
                    <div
                        id='scratch_div'
                        style={{
                            width: 'calc(100vw - 3.2rem)',
                            height: 'var(--bot-content-height)',
                        }}
                    >
                        <WorkspaceWrapper />
                        {active_tab === 1 && !onboard_tour_run_state && (
                            <ReactJoyride
                                steps={BOT_BUILDER_TOUR}
                                continuous={true}
                                showProgress={true}
                                styles={{
                                    options: {
                                        arrowColor: 'var(--text-general)',
                                        backgroundColor: 'var(--text-general)',
                                        overlayColor: 'rgba(0, 0, 0, 0.5)',
                                        primaryColor: 'var(--brand-red-coral)',
                                        textColor: 'var(--text-colored-background)',
                                        spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
                                    },
                                }}
                            />
                        )}
                    </div>
                )}
                {/* removed this outside from toolbar becuase it needs to loaded seperately without dependency */}
                <LoadModal />
            </div>
        </>
    );
};

export default connect(({ app, dashboard }: RootStore) => ({
    app,
    active_tab: dashboard.active_tab,
    onboard_tour_run_state: dashboard.onboard_tour_run_state,
    setOnBoardTourRunState: dashboard.setOnBoardTourRunState,
    is_preview_on_popup: dashboard.is_preview_on_popup,
}))(BotBuilder);
