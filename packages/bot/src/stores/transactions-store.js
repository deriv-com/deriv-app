import { action, observable } from 'mobx';
import { observer } from '../utils/observer';

export default class TransactionsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;

        observer.register('bot.contract', this.onBotContractEvent);
    }

    @observable contracts = [];

    @action.bound
    onBotContractEvent(data) {
        this.pushTransaction(data);
    }

    @action.bound
    pushTransaction(data) {
        const contract = {
            buy_price    : data.buy_price,
            contract_type: data.contract_type,
            refrence_id  : data.transaction_ids.buy,
            entry_spot   : data.entry_spot,
            exit_spot    : data.entry_tick_display_value,
            profit       : data.profit,
        };
        this.contracts.unshift(contract);
        this.contracts = this.contracts.slice(0);  // force array update
    }

    onUnmount() {
        observer.unregister('contract.status', this.onBotContractEvent);
    }
}
