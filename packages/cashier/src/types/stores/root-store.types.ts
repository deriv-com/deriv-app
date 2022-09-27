import { TClientStore } from './client-store.types';
import { TCommonStore } from './common-store.types';
import { TNotificationStore } from './notification-store.types';
import { TUiStore } from './ui-store.types';

export type RootStore = {
    client: TClientStore;
    common: TCommonStore;
    menu: any;
    modules: any;
    notifications: TNotificationStore;
    ui: TUiStore;
};

export type TRootStore = RootStore;
