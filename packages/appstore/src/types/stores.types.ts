import ConfigStore from 'Stores/config-store';
import WalletStore from 'Stores/wallet-store';
import { Authorize as TAuthorize } from '@deriv/api-types';

export type TRootStore = {
    ui: Record<string, any>;
    client: Record<string, any>;
    config: ConfigStore;
    wallet_store: WalletStore;
};

type TAccountList = NonNullable<TAuthorize['account_list']>[number];
export type TExtendedAccountList = TAccountList & {
    created_at: number;
};

type TExtendedAuthorize = TAuthorize & {
    account_list: TExtendedAccountList[];
};

export type Authorize = TExtendedAuthorize;
