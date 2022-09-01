import React from 'react';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import WorkspaceWrapper from './workspace-wrapper';

interface BotBuilderProps {
    app: any;
}

const BotBuilder = ({ app }: BotBuilderProps) => {
    const { onMount, onUnmount } = app;

    React.useEffect(() => {
        onMount();
        return () => {
            onUnmount();
        };
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
        </div>
    );
};

export default connect((store: RootStore) => ({
    app: store.app,
}))(BotBuilder);
