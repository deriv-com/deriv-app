import { TRootStore } from 'Types';
import ConfigStore from './config-store';
import WalletStore from './wallet-store';

export default class RootStore {
    public config: ConfigStore;
    public ws: unknown;
    public client: Record<string, any>;
    public common: Record<string, any>;
    public ui: Record<string, any>;
    public cfd_account: Record<string, any>;
    public wallet_store: WalletStore;
    public modules: Record<string, any>;

    public constructor(core_store: TRootStore) {
        this.config = new ConfigStore(this);
        this.client = core_store.client;
        this.common = core_store.common;
        this.ui = core_store.ui;
        this.cfd_account = core_store.cfd_account;
        this.wallet_store = new WalletStore(this);
        this.modules = core_store.modules;
    }
}
