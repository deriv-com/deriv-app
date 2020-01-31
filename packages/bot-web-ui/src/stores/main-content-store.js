import { action, observable, reaction } from 'mobx';
import { onWorkspaceResize } from '@deriv/bot-skeleton';
import { tabs_title } from '../constants/bot-contents';

export default class MainContentStore {
    constructor(root_store) {
        this.root_store = root_store;
        const { run_panel } = this.root_store;

        this.disposeIsDrawerOpenReaction = reaction(
            () => run_panel.is_drawer_open,
            () => this.setContainerSize()
        );
    }

    @observable active_tab = tabs_title.WORKSPACE;

    @action.bound
    setActiveTab(tab) {
        this.active_tab = tab;
    }

    @action.bound
    setContainerSize() {
        if (this.active_tab === tabs_title.WORKSPACE) {
            onWorkspaceResize();
        }
    }

    @action.bound
    onMount() {
        window.addEventListener('resize', this.setContainerSize);
    }

    @action.bound
    onUnmount() {
        window.removeEventListener('resize', this.setContainerSize);
        this.disposeIsDrawerOpenReaction();
    }
}
