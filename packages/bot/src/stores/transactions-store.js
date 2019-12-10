import { action, observable }   from 'mobx';
import { formatDate }           from 'deriv-shared/utils/date';
import { isEnded }              from '../utils/contract';
import { transaction_elements } from '../constants/transactions';

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
            barrier        : data.barrier,
            buy_price      : data.buy_price,
            contract_type  : data.contract_type,
            currency       : data.currency,
            display_name   : data.display_name,
            date_start     : formatDate(data.date_start, 'YYYY-M-D HH:mm:ss [GMT]'),
            entry_tick     : data.entry_tick_display_value,
            entry_tick_time: data.entry_tick_time && formatDate(data.entry_tick_time, 'YYYY-M-D HH:mm:ss [GMT]'),
            exit_tick      : data.exit_tick_display_value,
            exit_tick_time : data.exit_tick_time && formatDate(data.exit_tick_time, 'YYYY-M-D HH:mm:ss [GMT]'),
            high_barrier   : data.high_barrier,
            is_completed,
            low_barrier    : data.low_barrier,
            profit         : is_completed && data.profit,
            run_id,
            shortcode      : data.shortcode,
            tick_count     : data.tick_count,
            transaction_ids: data.transaction_ids,
            underlying     : data.underlying,
        };

        const same_contract_index = this.elements.findIndex(c =>
            c.type === transaction_elements.CONTRACT &&
            c.data.transaction_ids &&  c.data.transaction_ids.buy === data.transaction_ids.buy
        );

        if (same_contract_index === -1) {
            // Render a divider if the "run_id" for this contract is different.
            if (this.elements.length > 0) {
                const is_new_run =
                    this.elements[0].type === transaction_elements.CONTRACT &&
                    contract.run_id !== this.elements[0].data.run_id;

                if (is_new_run) {
                    this.elements.unshift({
                        type: transaction_elements.DIVIDER,
                        data: contract.run_id,
                    });
                }
            }

            this.elements.unshift({
                type: transaction_elements.CONTRACT,
                data: contract,
            });
        } else {
            // If data belongs to existing contract in memory, update it.
            this.elements.splice(same_contract_index, 1, {
                type: transaction_elements.CONTRACT,
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
