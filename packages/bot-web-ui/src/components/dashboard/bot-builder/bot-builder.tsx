import React from 'react';
import RootStore from 'Stores/index';
import AppStore from 'Stores/app-store';
import { connect } from 'Stores/connect';
import WorkspaceWrapper from './workspace-wrapper';
import ReactJoyride from 'react-joyride';
import { BOT_BUILDER_TOUR } from '../joyride-config';

type TBotBuilder = {
    app: AppStore;
};

const BotBuilder = ({ app }: TBotBuilder) => {
    const { onMount, onUnmount } = app;

    React.useEffect(() => {
        onMount();
        return () => onUnmount();
    }, []);

    return (
        <div
            id='scratch_div'
            style={{
                width: '100vw',
                height: 'var(--bot-content-height)',
            }}
        >
            <WorkspaceWrapper />
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
                        zIndex: 100,
                    },
                    buttonClose: {
                        color: 'white',
                    },
                }}
            />
        </div>
    );
};

export default connect((store: RootStore) => ({
    app: store.app,
}))(BotBuilder);
