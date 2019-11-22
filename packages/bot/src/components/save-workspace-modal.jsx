import classNames       from 'classnames';
import React            from 'react';
import PropTypes        from 'prop-types';
import {
    Modal,
    Button,
}                       from 'deriv-components';
import { localize }     from 'deriv-translations/lib/i18n';
import { connect }      from '../stores/connect';
import '../assets/sass/save-workspace-modal.scss';

const SaveWorkspaceModal = ({
    is_save_workspace_modal_open,
    loadWorkspace,
    previewWorkspace,
    removeWorkspace,
    selected_strategy,
    toggleSaveWorkpsaceModal,
    workspace_list,
}) => (
    <Modal
        title={localize('Unsaved workspace')}
        className='modal--save-workspace'
        width='450px'
        is_open={is_save_workspace_modal_open}
        toggleModal={toggleSaveWorkpsaceModal}
    >
        <div className='modal__content'>
            <div className='modal--save-workspace-list'>
                {
                    workspace_list.map(workspace => {
                        const { id, name, timestamp } = workspace;
                        return (
                            <div
                                key={id}
                                className={classNames(
                                    'modal--save-workspace-item',
                                    { 'modal--save-workspace-item--active': selected_strategy.id === id }
                                )}
                                onClick={() => previewWorkspace(workspace)}
                            >
                                <span className='modal--save-workspace-remove' onClick={() => removeWorkspace(id)}>𝗫</span>
                                <div className='modal--save-workspace-btn'>
                                    <p className='modal--save-workspace-name'>{name}</p>
                                    <p className='modal--save-workspace-time'>{new Date(timestamp).toDateString()}</p>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            <div id='preview_workspace' />
        </div>
        <div className='modal__footer'>
            <Button
                className='modal--save-workspace-load'
                text={localize('Load')}
                onClick={loadWorkspace}
                has_effect
                primary
            />
        </div>
    </Modal>
);

SaveWorkspaceModal.prototype = {
    is_save_workspace_modal_open: PropTypes.bool,
    loadWorkspace               : PropTypes.func,
    previewWorkspace            : PropTypes.func,
    removeWorkspace             : PropTypes.func,
    selected_strategy           : PropTypes.string,
    toggleSaveWorkpsaceModal    : PropTypes.func,
    workspace_list              : PropTypes.array,
};

export default connect(({ save_workspace }) => ({
    is_save_workspace_modal_open: save_workspace.is_save_workspace_modal_open,
    loadWorkspace               : save_workspace.loadWorkspace,
    previewWorkspace            : save_workspace.previewWorkspace,
    removeWorkspace             : save_workspace.removeWorkspace,
    selected_strategy           : save_workspace.selected_strategy,
    toggleSaveWorkpsaceModal    : save_workspace.toggleSaveWorkpsaceModal,
    workspace_list              : save_workspace.workspace_list,
}))(SaveWorkspaceModal);
