import ProfitTableStore from './Profit/profit-store';
import StatementStore from './Statement/statement-store';

export default class ModulesStore {
    constructor(root_store) {
        this.profit_table = new ProfitTableStore({ root_store });
        this.statement = new StatementStore({ root_store });
    }
}
