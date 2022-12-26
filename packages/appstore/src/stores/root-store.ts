import { TRootStore } from 'Types';
import ConfigStore from './config-store';

export default class RootStore {
    public config: ConfigStore;
    public ws: unknown;
    public client: Record<string, any>;
    public common: Record<string, any>;
    public ui: Record<string, any>;
    public modules: Record<string, any>;
    public notifications: Record<string, any>;
    public traders_hub: Record<string, any>;

    public constructor(core_store: TRootStore) {
        this.config = new ConfigStore(this);
        this.client = core_store.client;
        this.common = core_store.common;
        this.ui = core_store.ui;
        this.modules = core_store.modules;
        this.notifications = core_store.notifications;
        this.traders_hub = core_store.traders_hub;
    }
}
