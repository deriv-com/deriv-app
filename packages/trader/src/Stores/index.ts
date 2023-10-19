import { TCoreStores } from '@deriv/stores/types';
import ModulesStore from './Modules';

export default class RootStore {
    client: TCoreStores['client'];
    common: TCoreStores['common'];
    modules: ModulesStore;
    ui: TCoreStores['ui'];
    gtm: TCoreStores['gtm'];
    notifications: TCoreStores['notifications'];
    contract_replay: TCoreStores['contract_replay'];
    contract_trade: TCoreStores['contract_trade'];
    portfolio: TCoreStores['portfolio'];
    chart_barrier_store: TCoreStores['chart_barrier_store'];
    active_symbols: TCoreStores['active_symbols'];

    constructor(core_store: TCoreStores) {
        this.client = core_store.client;
        this.common = core_store.common;
        this.modules = new ModulesStore(this, core_store);
        this.ui = core_store.ui;
        this.gtm = core_store.gtm;
        this.notifications = core_store.notifications;
        this.contract_replay = core_store.contract_replay;
        this.contract_trade = core_store.contract_trade;
        this.portfolio = core_store.portfolio;
        this.chart_barrier_store = core_store.chart_barrier_store;
        this.active_symbols = core_store.active_symbols;
    }
}
