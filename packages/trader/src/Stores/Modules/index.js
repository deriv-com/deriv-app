import {
    ContractReplayStore,
    ContractTradeStore,
    PortfolioStore,
    ProfitTableStore,
    StatementStore,
    TradeStore,
} from '@deriv/reports';

export default class ModulesStore {
    constructor(root_store, core_store) {
        this.cashier = core_store.modules.cashier;
        this.contract_replay = new ContractReplayStore({ root_store });
        this.contract_trade = new ContractTradeStore({ root_store });
        this.portfolio = new PortfolioStore({ root_store });
        this.profit_table = new ProfitTableStore({ root_store });
        this.statement = new StatementStore({ root_store });
        this.trade = new TradeStore({ root_store });
    }
}
