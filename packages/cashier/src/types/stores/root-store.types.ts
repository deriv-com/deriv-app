import { TClientStore } from './client-store.types';
import { TCommonStore } from './common-store.types';
import { TUiStore } from './ui-store.types';

export class RootStore {
    client: TClientStore;
    common: TCommonStore;
    modules: any;
    ui: TUiStore;
    constructor(core_store: { client: TClientStore; common: TCommonStore; modules: any; ui: TUiStore }) {
        this.client = core_store.client;
        this.common = core_store.common;
        this.modules = core_store.modules;
        this.ui = core_store.ui;
    }
}
