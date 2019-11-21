import classNames       from 'classnames';
import React            from 'react';
import PropTypes        from 'prop-types';
import {
    Modal,
}                       from 'deriv-components';
import { localize }     from 'deriv-translations/lib/i18n';
import { connect }      from '../stores/connect';
import '../assets/sass/save-workspace-modal.scss';

const SaveWorkspaceModal = ({
    is_save_workspace_modal_open,
    previewWorkspace,
    removeWorkspace,
    selected_button,
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
                    workspace_list.map(({ id, name, strategy, timestamp }) => {
                        return (
                            <div
                                key={id}
                                className={classNames(
                                    'modal--save-workspace-item',
                                    { 'modal--save-workspace-item--active': selected_button === id }
                                )}
                                onClick={() => previewWorkspace(id, strategy)}
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
    </Modal>
);

SaveWorkspaceModal.prototype = {
    is_save_workspace_modal_open: PropTypes.bool,
    previewWorkspace            : PropTypes.func,
    removeWorkspace             : PropTypes.func,
    selected_button             : PropTypes.string,
    toggleSaveWorkpsaceModal    : PropTypes.func,
    workspace_list              : PropTypes.array,
};

export default connect(({ save_workspace }) => ({
    is_save_workspace_modal_open: save_workspace.is_save_workspace_modal_open,
    previewWorkspace            : save_workspace.previewWorkspace,
    removeWorkspace             : save_workspace.removeWorkspace,
    selected_button             : save_workspace.selected_button,
    toggleSaveWorkpsaceModal    : save_workspace.toggleSaveWorkpsaceModal,
    workspace_list              : save_workspace.workspace_list,
}))(SaveWorkspaceModal);
