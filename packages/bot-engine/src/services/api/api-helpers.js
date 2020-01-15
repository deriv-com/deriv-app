import TradingTimes  from './trading-times';
import ContractsFor  from './contracts-for';
import ActiveSymbols from './active-symbols';

class ApiHelpers {
    static singleton = null;

    constructor(api_helper_store) {
        this.trading_times    = new TradingTimes(api_helper_store);
        this.contracts_for    = new ContractsFor(api_helper_store);
        this.active_symbols   = new ActiveSymbols(api_helper_store.ws, this.trading_times);
    }

    static setInstance(api_helper_store) {
        if (!this.singleton) {
            this.singleton = new ApiHelpers(api_helper_store);
        }

        return this.instance;
    }

    static get instance() {
        return this.singleton;
    }
}

export default ApiHelpers;
