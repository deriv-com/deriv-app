import ConfigStore from 'Stores/config-store';
import WalletStore from 'Stores/wallet-store';
import { Authorize } from '@deriv/api-types';

export type TRootStore = {
    ui: Record<string, any>;
    client: Record<string, any>;
    config: ConfigStore;
    wallet_store: WalletStore;
};

export type TWalletAccount = Required<Authorize>['account_list'] & {
    created_at: number;
};
