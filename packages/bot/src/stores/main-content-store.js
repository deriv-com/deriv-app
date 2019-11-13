import {
    action,
    observable,
} from 'mobx';
import { scratchWorkspaceInit } from '../scratch/index';

export default class MainContentStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable active_index = 0;

    @action.bound
    onTabItemClick(index) {
        this.active_index = index;
    }

    @action.bound
    componentDidUpdate(){
        if (this.active_index === 0) {
            scratchWorkspaceInit();
        } else if (Blockly.derivWorkspace) {
            Blockly.derivWorkspace.dispose();
        }
    }
}
