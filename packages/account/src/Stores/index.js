export default class RootStore {
    constructor(core_store) {
        this.client = core_store.client;
        this.common = core_store.common;
        this.ui = core_store.ui;
        this.gtm = core_store.gtm;
        this.rudderstack = core_store.rudderstack;
        this.pushwoosh = core_store.pushwoosh;
    }
}
