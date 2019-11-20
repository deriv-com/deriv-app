import {
    action,
    observable,
} from 'mobx';
import { tabs_title } from '../constants/bot-contents';
import { scratchWorkspaceInit } from '../scratch/index';

export default class MainContentStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable active_tab = tabs_title.WORKSPACE;

    @action.bound
    componentDidUpdate() {
        if (this.active_tab === tabs_title.WORKSPACE) {
            scratchWorkspaceInit();
        } else if (Blockly.derivWorkspace) {
            Blockly.derivWorkspace.dispose();
        }
    }
}
