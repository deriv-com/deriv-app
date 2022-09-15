import React from 'react';
import { localize } from '@deriv/translations';
import Cards from './cards';
import WorkspaceControl from '../../load-modal/workspace-control';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import LoadModalStore from 'Stores/load-modal-store';

type TDashboardProps = {
    load_modal: LoadModalStore;
};
const Dashboard = ({ load_modal }: TDashboardProps) => {
    const file_input_ref = React.useRef<HTMLInputElement>(null);
    const openFileLoader = () => {
        file_input_ref?.current?.click();
    };
    const { onDriveConnect, toggleLoadModal, handleFileChange } = load_modal;
    const [is_file_supported, setIsFileSupported] = React.useState(true);
    return (
        <>
            <div style={{ display: 'flex' }}>
                <div className='dc-tabs__content_group'>
                    <span className='dc-tabs__content_group_heading'>{localize('Load or build your bot')}</span>
                    <span className='dc-tabs__content_group_description'>
                        {localize(
                            'Import bot from your computer or Google Drive, build it from scratch, or start with a quick strategy.'
                        )}
                    </span>
                    <Cards openFileLoader={openFileLoader} />
                </div>
                <input
                    type='file'
                    ref={file_input_ref}
                    accept='.xml'
                    style={{ display: 'none' }}
                    onChange={e => setIsFileSupported(handleFileChange(e, false))}
                />
                <div id='load-strategy__blockly-container' style={{ height: '100%', width: '100%' }}>
                    <WorkspaceControl />
                </div>
            </div>
        </>
    );
};

export default connect((store: RootStore) => ({
    load_modal: store.load_modal,
    active_tab: store.dashbaord.active_tab,
    setActiveTab: store.dashbaord.setActiveTab,
    handleFileChange: store.load_modal.handleFileChange,
    toggleLoadModal: store.load_modal.toggleLoadModal,
}))(Dashboard);
