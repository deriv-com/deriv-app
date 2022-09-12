import { TClientStore } from './client-store.types';
import { TCommonStore } from './common-store.types';
import { TUiStore } from './ui-store.types';

export type TRootStore = {
    client: TClientStore;
    common: TCommonStore;
    modules: any;
    ui: TUiStore;
};
