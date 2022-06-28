export class RootStore {
    client: any;
    common: any;
    modules: any;
    ui: any;
    constructor(core_store: { client: any; common: any; modules: any; ui: any }) {
        this.client = core_store.client;
        this.common = core_store.common;
        this.modules = core_store.modules;
        this.ui = core_store.ui;
    }
}
