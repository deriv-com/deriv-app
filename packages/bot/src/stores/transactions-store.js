import { action, observable } from 'mobx';
import { isEnded }            from '../utils/contract';

export default class TransactionsStore {

    @observable contracts = [];

    @action.bound
    onBotContractEvent(data) {
        this.pushTransaction(data);
    }

    @action.bound
    pushTransaction(data) {
        const is_completed  = isEnded(data);
        const contract = {
            buy_price    : data.buy_price,
            contract_type: data.contract_type,
            currency     : data.currency,
            refrence_id  : data.transaction_ids.buy,
            entry_spot   : data.entry_tick_display_value,
            exit_spot    : data.exit_tick_display_value,
            profit       : is_completed && data.profit,
            is_completed,
        };
        if (this.contracts.some(e => e.refrence_id === data.transaction_ids.buy)) {
            this.contracts.shift();
        }
        this.contracts.unshift(contract);
        this.contracts = this.contracts.slice(0);  // force array update
    }

    @action.bound
    clear(){
        this.contracts = this.contracts.slice(0,0);  // force array update
    }
}
