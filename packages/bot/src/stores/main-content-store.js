import {
    action,
    observable,
    reaction,
}                                  from 'mobx';
import { tabs_title }              from '../constants/bot-contents';
import { onWorkspaceResize }       from '../scratch/utils/scratch-helper';
import { getRunPanelWidth }        from '../utils/window-size';

export default class MainContentStore {
    constructor(root_store) {
        this.root_store = root_store;
        const { run_panel } = this.root_store;

        window.addEventListener('resize', this.setCharContainerSize);

        reaction(
            () => [run_panel.is_drawer_open, this.active_tab],
            () => this.setCharContainerSize());
    }

    @observable active_tab = tabs_title.WORKSPACE;
    @observable width = window.innerWidth;

    @action.bound
    setCharContainerSize() {
        switch (this.active_tab) {
            case (tabs_title.CHART): {
                const run_panel_width = getRunPanelWidth(this.root_store.run_panel.is_drawer_open);
                this.width = window.innerWidth - run_panel_width;
                break;
            }
            case (tabs_title.WORKSPACE) :
            default: {
                onWorkspaceResize();
            }
        }
    }

    @action.bound
    setActiveTab(tab) {
        this.active_tab = tab;
    }
}
