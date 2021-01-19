import { action, observable } from 'mobx';
import { onWorkspaceResize } from '@deriv/bot-skeleton';
import { tabs_title } from 'Constants/bot-contents';
import { storeSetting, getSetting } from 'Utils/settings';

export default class MainContentStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable active_tab = tabs_title.WORKSPACE;

    @action.bound
    setActiveTab(tab) {
        this.active_tab = tab;
        storeSetting('active_tab', this.active_tab);
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
    getCachedActiveTab() {
        if (getSetting('active_tab')) {
            this.active_tab = getSetting('active_tab');
        }
    }

    @action.bound
    onUnmount() {
        window.removeEventListener('resize', this.setContainerSize);
    }
}
