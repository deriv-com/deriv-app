export type TCoreStore = {
    client: Record<string, any>;
    common: Record<string, any>;
    ui: Record<string, any>;
    gtm: Record<string, any>;
    rudderstack: Record<string, any>;
    pushwoosh: Record<string, any>;
};

export default class RootStore {
    public client: Record<string, any>;
    public common: Record<string, any>;
    public ui: Record<string, any>;
    public gtm: Record<string, any>;
    public rudderstack: Record<string, any>;
    public pushwoosh: Record<string, any>;

    constructor(core_store: TCoreStore) {
        this.client = core_store.client;
        this.common = core_store.common;
        this.ui = core_store.ui;
        this.gtm = core_store.gtm;
        this.rudderstack = core_store.rudderstack;
        this.pushwoosh = core_store.pushwoosh;
    }
}
