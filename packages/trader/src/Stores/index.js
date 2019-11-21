import ModulesStore from './Modules';

export default class RootStore {
    constructor(core_store) {
        this.client  = core_store.client;
        this.common  = core_store.common;
        this.modules = new ModulesStore(this, core_store);
        this.ui      = core_store.ui;
        this.gtm     = core_store.gtm;
        this.segment = core_store.segment;
    }
}
