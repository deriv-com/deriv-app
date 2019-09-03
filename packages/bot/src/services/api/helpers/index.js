import TradingTimes  from './trading-times';
import ContractsFor  from './contracts-for';
import ActiveSymbols from './active-symbols';

class ApiHelpers {
    static singleton = null;

    constructor(root_store) {
        this.root_store     = root_store;
        this.trading_times  = new TradingTimes(this.root_store);
        this.contracts_for  = new ContractsFor(this.root_store);
        this.active_symbols = new ActiveSymbols(this.root_store, this.trading_times);
    }

    static setInstance(root_store) {
        if (!this.singleton) {
            this.singleton = new ApiHelpers(root_store);
        }
    }

    static get instance() {
        return this.singleton;
    }
}

export default ApiHelpers;
