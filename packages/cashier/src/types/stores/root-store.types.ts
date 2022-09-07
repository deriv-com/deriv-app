import { TClientStore } from './client-store.types';
import { TCommonStore } from './common-store.types';
import { TUiStore } from './ui-store.types';
import { TNotificationStore } from './notification-store.types';

export type TRootStore = {
    client: TClientStore;
    common: TCommonStore;
    modules: any;
    notifications: TNotificationStore;
    ui: TUiStore;
};
