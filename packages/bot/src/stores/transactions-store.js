import { action, observable } from 'mobx';
import { formatDate }         from 'deriv-shared/utils/date';
import { isEnded }            from '../utils/contract';
import { transactions } from '../constants/transactions';

export default class TransactionsStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable elements = [];

    @action.bound
    onBotContractEvent(data) {
        this.pushTransaction(data);
    }

    @action.bound
    pushTransaction(data) {
        const is_completed = isEnded(data);
        const { run_id }   = this.root_store.run_panel;
        const contract     = {
            buy_price    : data.buy_price,
            contract_type: data.contract_type,
            currency     : data.currency,
            display_name : data.display_name,
            date_start   : formatDate(data.date_start, 'YYYY-M-D HH:mm:ss [GMT]'),
            reference_id : data.transaction_ids.buy,
            entry_spot   : data.entry_tick_display_value,
            exit_spot    : data.exit_tick_display_value,
            profit       : is_completed && data.profit,
            shortcode    : data.shortcode,
            underlying   : data.underlying,
            is_completed,
            run_id,
        };

        const same_contract_index = this.elements.findIndex(c =>
            c.type === transactions.CONTRACT && c.data.reference_id === data.transaction_ids.buy
        );

        if (same_contract_index === -1) {
            // Render a divider if the "run_id" for this contract is different.
            if (this.elements.length > 0) {
                const first_element = this.elements[0];
                const is_new_run    = first_element.type === transactions.CONTRACT && contract.run_id !== first_element.data.run_id;

                if (is_new_run) {
                    this.elements.unshift({
                        type: 'divider',
                        data: contract.run_id,
                    });
                }
            }

            this.elements.unshift({
                type: transactions.CONTRACT,
                data: contract,
            });
        } else {
            // Replace existing contract element with updated object.
            this.elements.splice(same_contract_index, 1, {
                type: transactions.CONTRACT,
                data: contract,
            });
        }

        this.elements = this.elements.slice(); // force array update
    }

    @action.bound
    clear() {
        this.elements = this.elements.slice(0, 0); // force array update
    }
}
