import { action, observable, makeObservable } from 'mobx';
import { onWorkspaceResize } from '@deriv/bot-skeleton';
import { tabs_title } from 'Constants/bot-contents';
import { storeSetting, getSetting } from 'Utils/settings';

export default class MainContentStore {
    constructor(root_store) {
        makeObservable(this, {
            active_tab: observable,
            setActiveTab: action.bound,
            setContainerSize: action.bound,
            onMount: action.bound,
            getCachedActiveTab: action.bound,
            onUnmount: action.bound,
        });

        this.root_store = root_store;
    }

    active_tab = tabs_title.WORKSPACE;

    setActiveTab(tab) {
        this.active_tab = tab;
        storeSetting('active_tab', this.active_tab);
    }

    setContainerSize() {
        if (this.active_tab === tabs_title.WORKSPACE) {
            onWorkspaceResize();
        }
    }

    onMount() {
        window.addEventListener('resize', this.setContainerSize);
    }

    getCachedActiveTab() {
        if (getSetting('active_tab')) {
            this.active_tab = getSetting('active_tab');
        }
    }

    onUnmount() {
        window.removeEventListener('resize', this.setContainerSize);
    }
}
