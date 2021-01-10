import { action, computed, observable, reaction, when } from 'mobx';
import { formatDate, isEnded } from '@deriv/shared';
import { log_types } from '@deriv/bot-skeleton';
import { transaction_elements } from '../constants/transactions';
import { getStoredItemsByKey, getStoredItemsByUser, setStoredItemsByKey } from '../utils/session-storage';

export default class TransactionsStore {
    constructor(root_store) {
        this.root_store = root_store;
        this.disposeReactionsFn = this.registerReactions();
    }

    TRANSACTION_CACHE = 'transaction_cache';

    @observable elements = getStoredItemsByUser(this.TRANSACTION_CACHE, this.root_store.core.client.loginid, []);
    @observable active_transaction_id = null;

    @computed
    get transactions() {
        return this.elements.filter(element => element.type === transaction_elements.CONTRACT);
    }

    @action.bound
    onBotContractEvent(data) {
        this.pushTransaction(data);
    }

    @action.bound
    pushTransaction(data) {
        const is_completed = isEnded(data);
        const { run_id } = this.root_store.run_panel;
        const contract = {
            barrier: data.barrier,
            buy_price: data.buy_price,
            contract_id: data.contract_id,
            contract_type: data.contract_type,
            currency: data.currency,
            date_start: formatDate(data.date_start, 'YYYY-M-D HH:mm:ss [GMT]'),
            display_name: data.display_name,
            entry_tick: data.entry_tick_display_value,
            entry_tick_time: data.entry_tick_time && formatDate(data.entry_tick_time, 'YYYY-M-D HH:mm:ss [GMT]'),
            exit_tick: data.exit_tick_display_value,
            exit_tick_time: data.exit_tick_time && formatDate(data.exit_tick_time, 'YYYY-M-D HH:mm:ss [GMT]'),
            high_barrier: data.high_barrier,
            is_completed,
            low_barrier: data.low_barrier,
            payout: data.payout,
            profit: is_completed && data.profit,
            run_id,
            shortcode: data.shortcode,
            tick_count: data.tick_count,
            transaction_ids: data.transaction_ids,
            underlying: data.underlying,
        };

        const same_contract_index = this.elements.findIndex(
            c =>
                c.type === transaction_elements.CONTRACT &&
                c.data.transaction_ids &&
                c.data.transaction_ids.buy === data.transaction_ids.buy
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
        const path = event.path || (event.composedPath && event.composedPath());
        const is_transaction_click = path.some(
            el => el.classList && el.classList.contains('transactions__item-wrapper')
        );
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
        this.elements = this.elements.slice(0, 0);
    }

    registerReactions() {
        const { client } = this.root_store.core;

        // Write transactions to session storage on each change in transaction elements.
        const disposeTransactionElementsListener = reaction(
            () => this.elements,
            elements => {
                const stored_transactions = getStoredItemsByKey(this.TRANSACTION_CACHE, {});
                stored_transactions[client.loginid] = elements.slice(0, 5000);
                setStoredItemsByKey(this.TRANSACTION_CACHE, stored_transactions);
            }
        );

        // Attempt to load cached transactions on client loginid change.
        const disposeClientLoginIdListener = reaction(
            () => client.loginid,
            () => (this.elements = getStoredItemsByUser(this.TRANSACTION_CACHE, client.loginid, []))
        );

        // User could've left the page mid-contract. On initial load, try
        // to recover any pending contracts so we can reflect accurate stats
        // and transactions.
        const disposeRecoverContracts = when(
            () => this.elements.length,
            () => this.recoverPendingContracts()
        );

        return () => {
            disposeTransactionElementsListener();
            disposeClientLoginIdListener();
            disposeRecoverContracts();
        };
    }

    recoverPendingContracts() {
        const reported_transactions = [];

        this.transactions.forEach(({ data: trx }) => {
            if (trx.is_completed) return;

            const { ws } = this.root_store;

            ws.authorized.subscribeProposalOpenContract(trx.contract_id, response => {
                if (!response.error) {
                    const { proposal_open_contract } = response;

                    this.onBotContractEvent(proposal_open_contract);

                    if (!reported_transactions.includes(trx.contract_id) && isEnded(proposal_open_contract)) {
                        reported_transactions.push(trx.contract_id);

                        const { currency, profit } = proposal_open_contract;

                        this.root_store.journal.onLogSuccess({
                            log_type: profit > 0 ? log_types.PROFIT : log_types.LOST,
                            extra: { currency, profit },
                        });
                    }
                }
            });
        });
    }
}
