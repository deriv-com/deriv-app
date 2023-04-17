import React from 'react';
import Flyout from 'Components/flyout';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import StopBotModal from '../dashboard-component/load-bot-preview/stop-bot-modal';
import Toolbar from './toolbar';
import Toolbox from './toolbox';
import './workspace.scss';

type TWorkspaceWrapper = {
    onMount: () => void;
    onUnmount: () => void;
    is_loading: boolean;
};

const WorkspaceWrapper = ({ onMount, onUnmount, is_loading }: TWorkspaceWrapper) => {
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
};

export default connect(({ blockly_store }: RootStore) => ({
    onMount: blockly_store.onMount,
    onUnmount: blockly_store.onUnmount,
    is_loading: blockly_store.is_loading,
}))(WorkspaceWrapper);
