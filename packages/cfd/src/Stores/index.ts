import ModulesStore from './Modules';
import { TRootStore } from '../types';

export default class RootStore {
    client: any;
    common: any;
    modules: ModulesStore;
    ui: any;
    notifications: any;
    traders_hub: any;

    constructor(core_store: any) {
        this.client = core_store.client;
        this.common = core_store.common;
        this.modules = new ModulesStore(core_store);
        this.ui = core_store.ui;
        // this.gtm = core_store.gtm;
        // this.pushwoosh = core_store.pushwoosh;
        this.notifications = core_store.notifications;
        this.traders_hub = core_store.traders_hub;
    }
}
