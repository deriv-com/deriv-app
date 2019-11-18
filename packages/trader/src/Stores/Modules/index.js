import ContractReplayStore from './Contract/contract-replay-store';
import ContractTradeStore  from './Contract/contract-trade-store';
import MT5Store            from './MT5/mt5-store';
import PortfolioStore      from './Portfolio/portfolio-store';
import ProfitTableStore    from './Profit/profit-store';
import StatementStore      from './Statement/statement-store';
import TradeStore          from './Trading/trade-store';

export default class ModulesStore {
    constructor(root_store, core_store) {
        this.cashier         = core_store.modules.cashier;
        this.contract_replay = new ContractReplayStore({ root_store });
        this.contract_trade  = new ContractTradeStore({ root_store });
        this.mt5             = new MT5Store({ root_store });
        this.portfolio       = new PortfolioStore({ root_store });
        this.profit_table    = new ProfitTableStore({ root_store });
        this.statement       = new StatementStore({ root_store });
        this.trade           = new TradeStore({ root_store });
    }
}
