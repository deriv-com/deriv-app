import ModulesStore from './Modules';

export default class RootStore {
    constructor(core_store) {
        this.client = core_store.client;
        this.common = core_store.common;
        this.modules = new ModulesStore(this, core_store);
        this.ui = core_store.ui;
        this.gtm = core_store.gtm;
        this.pushwoosh = core_store.pushwoosh;
        this.notifications = core_store.notifications;
        this.contract_replay = core_store.contract_replay;
        this.contract_trade = core_store.contract_trade;
        this.portfolio = core_store.portfolio;
        this.chart_barrier_store = core_store.chart_barrier_store;
        this.active_symbols = core_store.active_symbols;
    }
}
