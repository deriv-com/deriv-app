import ContractStore    from './Contract/contract-store';
import PortfolioStore   from './Portfolio/portfolio-store';
import SmartChartStore  from './SmartChart/smart-chart-store';
import StatementStore   from './Statement/statement-store';
import TradeStore       from './Trading/trade-store';
import ProfitTableStore from './Profit/profit-store';

export default class ModulesStore {
    constructor(root_store) {
        this.contract     = new ContractStore({ root_store });
        this.portfolio    = new PortfolioStore({ root_store });
        this.profit_table = new ProfitTableStore({ root_store });
        this.smart_chart  = new SmartChartStore({ root_store });
        this.statement    = new StatementStore({ root_store });
        this.trade        = new TradeStore({ root_store });
    }
}
