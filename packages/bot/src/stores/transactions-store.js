import { action, observable }   from 'mobx';
import ContractUtils            from '@deriv/shared/utils/contract';
import { transaction_elements } from '../constants/transactions';

export default class TransactionsStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable elements              = [];
    @observable active_transaction_id = null;

    @action.bound
    onBotContractEvent(data) {
        this.pushTransaction(data);
    }
    
    @action.bound
    pushTransaction(data) {
        const is_completed = ContractUtils.isEnded(data);
        const { run_id }   = this.root_store.run_panel;
        const contract     = {
            barrier                 : data.barrier,
            buy_price               : data.buy_price,
            contract_type           : data.contract_type,
            currency                : data.currency,
            display_name            : data.display_name,
            date_expiry             : data.date_expiry,
            date_start              : data.date_start,
            entry_spot_display_value: data.entry_spot_display_value,
            entry_tick              : data.entry_tick_display_value,
            entry_tick_time         : data.entry_tick_time,
            exit_tick               : data.exit_tick_display_value,
            exit_tick_time          : data.exit_tick_time,
            high_barrier            : data.high_barrier,
            is_completed,
            is_expired              : data.is_expired,
            is_path_dependent       : data.is_path_dependent,
            low_barrier             : data.low_barrier,
            profit                  : is_completed && data.profit,
            purchase_time           : data.purchase_time,
            run_id,
            sell_time               : data.sell_time,
            shortcode               : data.shortcode,
            status                  : data.status,
            tick_count              : data.tick_count,
            transaction_ids         : data.transaction_ids,
            underlying              : data.underlying,
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
    setActiveTransactionId(transaction_id) {
        // Toggle transaction popover if passed transaction_id is the same.
        if (transaction_id && this.active_transaction_id === transaction_id) {
            this.active_transaction_id = null;
        } else {
            this.active_transaction_id = transaction_id;
        }
    }

    @action.bound
    onClickOutsideTransaction(event) {
        const is_transaction_click = event.path.some(el => el.classList && el.classList.contains('transactions__item-wrapper'));
        if (!is_transaction_click) {
            this.setActiveTransactionId(null);
        }
    }

    @action.bound
    onMount() {
        window.addEventListener('click', this.onClickOutsideTransaction);
    }

    @action.bound
    onUnmount() {
        window.removeEventListener('click', this.onClickOutsideTransaction);
    }

    @action.bound
    clear() {
        this.elements = this.elements.slice(0, 0); // force array update
    }
}
