import {
    action,
    observable,
    reaction,
} from 'mobx';
import { tabs_title } from '../constants/bot-contents';
import { scratchWorkspaceInit } from '../scratch/index';
import { getRunPanelWidth } from '../utils/window-size';

export default class MainContentStore {
    constructor(root_store) {
        this.root_store = root_store;
        window.addEventListener('resize', this.setCharContainerSize);
        reaction(
            () => this.root_store.run_panel.is_drawer_open,
            () => this.setCharContainerSize());
    }

    @observable active_tab = tabs_title.WORKSPACE;
    @observable width = window.innerWidth;

    @action.bound
    setCharContainerSize() {
        const run_panel_width = getRunPanelWidth(this.root_store.run_panel.is_drawer_open);
        this.width = window.innerWidth - run_panel_width;
        // resize workspace ?!
        // onWorkspaceResize();
    }

    @action.bound
    componentDidUpdate() {
        if (this.active_tab === tabs_title.WORKSPACE) {
            scratchWorkspaceInit();
        } else if (Blockly.derivWorkspace) {
            Blockly.derivWorkspace.dispose();
        }
    }
}
