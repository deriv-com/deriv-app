import {
    action,
    observable,
    reaction,
}                                  from 'mobx';
import { tabs_title }              from '../constants/bot-contents';
import { onWorkspaceResize }       from '../scratch/utils/scratch-helper';

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

    @action.bound
    setActiveTab(tab) {
        this.active_tab = tab;
    }

    @action.bound
    setCharContainerSize() {
        if (this.active_tab === tabs_title.WORKSPACE) {
            onWorkspaceResize();
        }
    }
}
