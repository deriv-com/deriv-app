import React from 'react';
import RootStore from 'Stores/index';
import AppStore from 'Stores/app-store';
import { connect } from 'Stores/connect';
import WorkspaceWrapper from './workspace-wrapper';
import classNames from 'classnames';

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
            <div
                id='scratch_div'
                style={{
                    width: 'calc(100vw - 3.2rem)',
                    height: 'var(--bot-content-height)',
                }}
            >
                <WorkspaceWrapper />
            </div>
        </div>
    );
};

export default connect((store: RootStore) => ({
    app: store.app,
    active_tab: store.dashboard.active_tab,
}))(BotBuilder);
