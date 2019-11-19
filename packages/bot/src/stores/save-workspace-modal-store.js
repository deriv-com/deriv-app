import { observable, action } from 'mobx';

export default class SaveWorkspaceModalStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable is_save_workspace_modal_open = false;
    @observable workspace_list = [];

    @action.bound
    toggleSaveWorkpsaceModal() {
        this.is_save_workspace_modal_open = !this.is_save_workspace_modal_open;
    }

    @action.bound
    setWorkspaceList(workspace_list) {
        this.workspace_list = workspace_list;
    }
}
