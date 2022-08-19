export type TClientStore = {
    balance?: string;
    currency: string;
    is_logging_in: boolean;
    is_virtual: boolean;
    local_currency_config: {
        currency: string;
        decimal_places: number;
    };
    loginid: string;
    residence: string;
};
export class RootStore {
    client: TClientStore;
    common: any;
    modules: any;
    ui: any;
    constructor(core_store: { client: TClientStore; common: any; modules: any; ui: any }) {
        this.client = core_store.client;
        this.common = core_store.common;
        this.modules = core_store.modules;
        this.ui = core_store.ui;
    }
}
