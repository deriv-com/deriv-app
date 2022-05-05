import ConfigStore from 'Stores/config-store';
import WalletStore from 'Stores/wallet-store';

export type TRootStore = {
    ui: any;
    client: any;
    config: ConfigStore;
    wallet_store: WalletStore;
};
