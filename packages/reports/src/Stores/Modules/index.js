import PortfolioStore from './Portfolio/portfolio-store';
import ProfitTableStore from './Profit/profit-store';
import StatementStore from './Statement/statement-store';
import TradeStore from './Trading/trade-store';

export default class ModulesStore {
    constructor(root_store) {
        this.portfolio = new PortfolioStore({ root_store });
        this.profit_table = new ProfitTableStore({ root_store });
        this.statement = new StatementStore({ root_store });
        this.trade = new TradeStore({ root_store });
    }
}
