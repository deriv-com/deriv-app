import ModulesStore from './Modules';
import type { TCoreStores } from '@deriv/stores/types';

export default class RootStore {
    client: TCoreStores['client'];
    common: TCoreStores['common'];
    modules: ModulesStore;
    ui: TCoreStores['ui'];
    notifications: TCoreStores['notifications'];
    traders_hub: TCoreStores['traders_hub'];

    constructor(core_store: TCoreStores) {
        this.client = core_store.client;
        this.common = core_store.common;
        this.modules = new ModulesStore(core_store);
        this.ui = core_store.ui;
        this.notifications = core_store.notifications;
        this.traders_hub = core_store.traders_hub;
    }
}
