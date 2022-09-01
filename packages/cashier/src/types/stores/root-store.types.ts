import { TClientStore } from './client-store.types';
import { TCommonStore } from './common-store.types';
import { TUiStore } from './ui-store.types';

export type RootStore = {
    client: TClientStore;
    common: TCommonStore;
    modules: any;
    ui: TUiStore;
};

export type TRootStore = RootStore;
