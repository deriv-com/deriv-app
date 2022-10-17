import React from 'react';
import RootStore from 'Stores/index';
import AppStore from 'Stores/app-store';
import { connect } from 'Stores/connect';
import WorkspaceWrapper from './workspace-wrapper';
import ReactJoyride from 'react-joyride';
import classNames from 'classnames';
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
        <>
            <div className={classNames('bot-builder', { 'bot-builder--active': active_tab === 1 })}>
                <div
                    id='scratch_div'
                    style={{
                        width: 'calc(100vw - 3.2rem)',
                        height: 'var(--bot-content-height)',
                    }}
                >
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
                                    primaryColor: '#FF444F',
                                    textColor: 'white',
                                    spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
                                },
                                buttonClose: {
                                    color: 'white',
                                },
                            }}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default connect((store: RootStore) => ({
    app: store.app,
    active_tab: store.dashboard.active_tab,
}))(BotBuilder);
