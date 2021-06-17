import TradingTimes from './trading-times';
import ContractsFor from './contracts-for';
import ActiveSymbols from './active-symbols';
import AccountLimits from './account-limits';

class ApiHelpers {
    static singleton = null;

    constructor(api_helpers_store) {
        this.trading_times = new TradingTimes(api_helpers_store);
        this.contracts_for = new ContractsFor(api_helpers_store);
        this.active_symbols = new ActiveSymbols(api_helpers_store.ws, this.trading_times);
        this.account_limits = new AccountLimits(api_helpers_store);
    }

    static setInstance(api_helpers_store) {
        if (!this.singleton) {
            this.singleton = new ApiHelpers(api_helpers_store);
        }

        return this.instance;
    }

    static get instance() {
        return this.singleton;
    }
}

export default ApiHelpers;
