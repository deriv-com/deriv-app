import { observable, action } from 'mobx';
import config                 from '../constants';
import {
    load,
    removeLocalWorkspace,
    getLocalWorkspace,
}                             from '../scratch/utils';

export default class SaveWorkspaceModalStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable is_save_workspace_modal_open = false;
    @observable workspace_list = [];
    @observable selected_strategy = {};
    preview_workspace = undefined;

    @action.bound
    toggleSaveWorkpsaceModal() {
        this.is_save_workspace_modal_open = !this.is_save_workspace_modal_open;
    }

    @action.bound
    setWorkspaceList(workspace_list) {
        this.workspace_list = workspace_list;
    }

    @action.bound
    loadWorkspace() {
        const { id, strategy } = this.selected_strategy;

        load(strategy);
        removeLocalWorkspace(id);
        this.toggleSaveWorkpsaceModal();
    }

    @action.bound
    previewWorkspace(workspace) {
        const { strategy } = workspace;
        if (!this.preview_workspace) {
            const workspace_element = document.getElementById('preview_workspace');

            this.preview_workspace = Blockly.inject(workspace_element, {
                media   : `${__webpack_public_path__}media/`, // eslint-disable-line
                readOnly  : true,
                scrollbars: true,
                zoom      : { wheel: true, startScale: config.workspaces.miniWorkspaceStartScale },
            });
        }

        this.selected_strategy = workspace;
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(strategy), this.preview_workspace);
    }

    @action.bound
    removeWorkspace(id) {
        removeLocalWorkspace(id);

        const local_workspace = getLocalWorkspace();
        if (local_workspace && local_workspace.length) {
            this.setWorkspaceList(local_workspace);
        }
    }
}
