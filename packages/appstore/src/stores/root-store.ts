import ConfigStore from './config-store';
import CreateWalletStore from './create-wallet-store';

export default class RootStore {
    public config: ConfigStore;
    public ws: unknown;
    public client: any;
    public common: any;
    public create_wallet: CreateWalletStore;
    public ui: any;

    public constructor(core_store: any) {
        this.config = new ConfigStore(this);
        this.client = core_store.client;
        this.common = core_store.common;
        this.create_wallet = new CreateWalletStore(this);
        this.ui = core_store.ui;
    }
}
