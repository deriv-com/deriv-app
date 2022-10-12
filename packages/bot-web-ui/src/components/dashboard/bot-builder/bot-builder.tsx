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
            <div id='scratch_div'>
                <WorkspaceWrapper />
            </div>
        </div>
    );
};

export default connect(({ app, dashboard }: RootStore) => ({
    app,
    active_tab: dashboard.active_tab,
}))(BotBuilder);
