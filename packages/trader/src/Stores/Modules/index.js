import TradeStore from './Trading/trade-store';

export default class ModulesStore {
    constructor(root_store, core_store) {
        this.cashier = core_store.modules.cashier;
        this.trade = new TradeStore({ root_store });
    }
}
