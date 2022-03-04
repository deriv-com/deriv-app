import ConfigStore from './config-store';

export default class RootStore {
    public config: ConfigStore;
    public ws: unknown;
    public client: any;
    public common: any;
    public ui: any;

    public constructor(core_store: any) {
        this.config = new ConfigStore(this);
        this.client = core_store.client;
        this.common = core_store.common;
        this.ui = core_store.ui;
    }
}
