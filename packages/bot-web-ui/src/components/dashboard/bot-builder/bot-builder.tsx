import React from 'react';
import RootStore from 'Stores/index';
import AppStore from 'Stores/app-store';
import { connect } from 'Stores/connect';
import ReactJoyride from 'react-joyride';
import classNames from 'classnames';
import WorkspaceWrapper from './workspace-wrapper';
import { BOT_BUILDER_TOUR } from '../joyride-config';

type TBotBuilder = {
    app: AppStore;
    active_tab: number;
};

const BotBuilder = ({ app, active_tab }: TBotBuilder) => {
    const { onMount, onUnmount } = app;

    React.useEffect(() => {
        onMount();
        return () => onUnmount();
    }, []);

    return (
        <div className={classNames('bot-builder', { 'bot-builder--active': active_tab === 1 })}>
            <div id='scratch_div'>
                <WorkspaceWrapper />
                {active_tab === 1 && (
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
        </div>
    );
};

export default connect(({ app, dashboard }: RootStore) => ({
    app,
    active_tab: dashboard.active_tab,
}))(BotBuilder);
