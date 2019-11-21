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
            () => [this.root_store.run_panel.is_drawer_open, this.active_tab],
            () => this.setCharContainerSize());
    }

    @observable active_tab = tabs_title.WORKSPACE;
    @observable chart_width = window.innerWidth;

    @action.bound
    setCharContainerSize() {
        if (this.active_tab === tabs_title.CHART) {
            const run_panel_width = getRunPanelWidth(this.root_store.run_panel.is_drawer_open);
            this.chart_width = window.innerWidth - run_panel_width;
        }
        // resize workspace ?!
        // onWorkspaceResize();
    }

    @action.bound
    componentDidMount() {
        this.initScratch();
    }

    @action.bound
    componentDidUpdate() {
        this.initScratch();
    }

    @action.bound
    initScratch() {
        if (this.active_tab === tabs_title.WORKSPACE) {
            scratchWorkspaceInit();
        } else if (Blockly.derivWorkspace) {
            Blockly.derivWorkspace.dispose();
        }
    }
}
