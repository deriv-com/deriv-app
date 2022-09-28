import { TClientStore } from './client-store.types';
import { TCommonStore } from './common-store.types';
import { TMenuStore } from './menu-store.types';
import { TNotificationStore } from './notification-store.types';
import { TUiStore } from './ui-store.types';
import CashierStore from '../../stores/cashier-store';

export type TRootStore = {
    client: TClientStore;
    common: TCommonStore;
    menu: TMenuStore;
    modules: {
        cashier: CashierStore;
    };
    notifications: TNotificationStore;
    ui: TUiStore;
};
