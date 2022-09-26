import { TClientStore } from './client-store.types';
import { TCommonStore } from './common-store.types';
import { TNotificationStore } from './notification-store.types';
import { TUiStore } from './ui-store.types';
import CashierStore from '../../stores/cashier-store';

export type RootStore = {
    client: TClientStore;
    common: TCommonStore;
    modules: {
        cashier: CashierStore;
    };
    notifications: TNotificationStore;
    ui: TUiStore;
};

export type TRootStore = RootStore;
