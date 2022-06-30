import ConfigStore from './config-store';

export type CoreStoreTypes = {
    config: ConfigStore;
    client: Record<string, unknown>;
    common: Record<string, unknown>;
    ui: Record<string, unknown>;
};
export default class RootStore {
    public config: ConfigStore;
    public ws: unknown;
    public client: Record<string, unknown>;
    public common: Record<string, unknown>;
    public ui: Record<string, unknown>;

    public constructor(core_store: CoreStoreTypes) {
        this.config = new ConfigStore(this);
        this.client = core_store.client;
        this.common = core_store.common;
        this.ui = core_store.ui;
    }
}
