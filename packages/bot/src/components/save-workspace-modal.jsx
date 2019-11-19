import React            from 'react';
import {
    Modal,
}                       from 'deriv-components';
import { localize }     from 'deriv-translations/lib/i18n';
import { connect }      from '../stores/connect';

const SaveWorkspaceModal = ({
    is_save_workspace_modal_open,
    toggleSaveWorkpsaceModal,
    workspace_list,
}) => (
    <Modal
        title={localize('Unsaved workspace')}
        className='modal--save-workspace'
        width='384px'
        is_open={is_save_workspace_modal_open}
        toggleModal={toggleSaveWorkpsaceModal}
    >
        {
            workspace_list.map(workspace => {
                return <div key={workspace.id}>{workspace.name}</div>;
            })
        }
    </Modal>
);

export default connect(({ save_workspace }) => ({
    is_save_workspace_modal_open: save_workspace.is_save_workspace_modal_open,
    toggleSaveWorkpsaceModal    : save_workspace.toggleSaveWorkpsaceModal,
    workspace_list              : save_workspace.workspace_list,
}))(SaveWorkspaceModal);
