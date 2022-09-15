import React from 'react';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import LoadModalStore from 'Stores/load-modal-store';
import WorkspaceControl from '../../load-modal/workspace-control';
import AppStore from 'Stores/app-store';

type BlocklyProps = {
    load_modal: LoadModalStore;
    is_loading: boolean;
    onMount: () => void;
    onUnmount: () => void;
    app: AppStore;
};

const BlocklyPreview = ({ load_modal, is_loading, app }: BlocklyProps) => {
    const file_input_ref = React.useRef(null);
    const [is_file_supported, setIsFileSupported] = React.useState(true);
    const { onMount, onUnmount } = app;

    React.useEffect(() => {
        onMount();
        return () => onUnmount();
    }, []);
    const openFileLoader = () => {
        file_input_ref.current.click();
    };
    const { handleFileChange } = load_modal;
    if (is_loading) return null;
    return (
        <div>
            <input
                type='file'
                ref={file_input_ref}
                accept='.xml'
                style={{ display: 'none' }}
                onChange={e => setIsFileSupported(handleFileChange(e, false))}
            />

            <div id='load-strategy__blockly-container' style={{ height: '100%', width: '100%' }}>
                {Blockly?.derivWorkspace && <WorkspaceControl />}
            </div>
        </div>
    );
};

export default connect((store: RootStore) => ({
    handleFileChange: store.load_modal.handleFileChange,
    is_loading: store.blockly_store.is_loading,
    onMount: store.main_content.onMount,
    onUnmount: store.main_content.onUnmount,
    app: store.app,
}))(BlocklyPreview);
