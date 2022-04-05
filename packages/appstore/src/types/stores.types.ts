import ConfigStore from 'Stores/config-store';
import CreateWalletStore from 'Stores/create-wallet-store';

export type TRootStore = {
    ui: any;
    client: any;
    config: ConfigStore;
    create_wallet: CreateWalletStore;
};
