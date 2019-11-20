import {
    action,
} from 'mobx';

export default class FooterExtensionStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @action.bound
    setActiveTab(tab) {
        this.root_store.main_content.active_tab = tab;
    }
}
