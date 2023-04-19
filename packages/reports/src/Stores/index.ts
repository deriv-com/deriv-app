import ModulesStore from './Modules';
import ProfitTableStore from './Modules/Profit/profit-store';
import StatementStore from './Modules/Statement/statement-store';
import type { TCoreStores } from '@deriv/stores/types';

export type TRootStore = TCoreStores & {
    modules: {
        profit_table: ProfitTableStore;
        statement: StatementStore;
    };
};

export default class RootStore {
    client: TCoreStores['client'];
    common: TCoreStores['common'];
    modules: ModulesStore;
    ui: TCoreStores['ui'];
    gtm: unknown;
    rudderstack: unknown;
    pushwoosh: unknown;
    notifications: TCoreStores['notifications'];
    contract_replay: unknown;
    contract_trade: TCoreStores['contract_trade'];
    portfolio: TCoreStores['portfolio'];
    chart_barrier_store: unknown;
    active_symbols: unknown;

    constructor(core_store: TCoreStores) {
        this.client = core_store.client;
        this.common = core_store.common;
        this.modules = new ModulesStore(this);
        this.ui = core_store.ui;
        this.gtm = core_store.gtm;
        this.rudderstack = core_store.rudderstack;
        this.pushwoosh = core_store.pushwoosh;
        this.notifications = core_store.notifications;
        this.contract_replay = core_store.contract_replay;
        this.contract_trade = core_store.contract_trade;
        this.portfolio = core_store.portfolio;
        this.chart_barrier_store = core_store.chart_barrier_store;
        this.active_symbols = core_store.active_symbols;
    }
}
