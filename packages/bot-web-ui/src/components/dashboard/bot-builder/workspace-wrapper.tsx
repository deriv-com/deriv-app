import React from 'react';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import Flyout from 'Components/flyout';
import Toolbox from './toolbox';
import Toolbar from './toolbar';
import './workspace.scss';
import StopBotModal from '../dashboard-component/load-bot-preview/stop-bot-modal';

const WorkspaceWrapper = observer(() => {
    const { blockly_store } = useDBotStore();
    const { onMount, onUnmount, is_loading } = blockly_store;

    React.useEffect(() => {
        onMount();
        return () => {
            onUnmount();
        };
    }, []);

    if (is_loading) return null;

    if (Blockly?.derivWorkspace)
        return (
            <React.Fragment>
                <Toolbox />
                <Toolbar />
                <Flyout />
                <StopBotModal />
            </React.Fragment>
        );

    return null;
});

export default WorkspaceWrapper;
