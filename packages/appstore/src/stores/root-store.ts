import ConfigStore from './config-store';

export default class RootStore {
    public config_store: ConfigStore;
    public ws: unknown;

    public constructor() {
        this.config_store = new ConfigStore(this);
    }
}
