import React from 'react';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import Flyout from 'Components/flyout';
import Toolbox from './toolbox';
import Toolbar from './toolbar';

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

    return (
        <>
            {Blockly?.derivWorkspace && (
                <>
                    <Toolbox />
                    <Toolbar />
                    <Flyout />
                </>
            )}
        </>
    );
};

export default connect((store: RootStore) => ({
    onMount: store.main_content.onMount,
    onUnmount: store.main_content.onUnmount,
    is_loading: store.blockly_store.is_loading,
}))(WorkspaceWrapper);
