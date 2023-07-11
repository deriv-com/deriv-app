import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { log_types } from '@deriv/bot-skeleton';
import { formatDate, isBot, isEnded } from '@deriv/shared';
import { transaction_elements } from '../constants/transactions';
import { getStoredItemsByKey, getStoredItemsByUser, setStoredItemsByKey } from '../utils/session-storage';

export default class TransactionsStore {
    constructor(root_store, core) {
        makeObservable(this, {
            elements: observable,
            active_transaction_id: observable,
            recovered_completed_transactions: observable,
            recovered_transactions: observable,
            is_called_proposal_open_contract: observable,
            transactions: computed,
            onBotContractEvent: action.bound,
            pushTransaction: action.bound,
            onClickOutsideTransaction: action.bound,
            onMount: action.bound,
            onUnmount: action.bound,
            clear: action.bound,
            setActiveTransactionId: action.bound,
            registerReactions: action.bound,
            recoverPendingContracts: action.bound,
            updateResultsCompletedContract: action.bound,
            sortOutPositionsBeforeAction: action.bound,
            recoverPendingContractsById: action.bound,
        });

        this.root_store = root_store;
        this.core = core;
        this.disposeReactionsFn = this.registerReactions();
    }

    TRANSACTION_CACHE = 'transaction_cache';

    elements = getStoredItemsByUser(this.TRANSACTION_CACHE, this.core?.client.loginid, []);
    active_transaction_id = null;
    recovered_completed_transactions = [];
    recovered_transactions = [];
    is_called_proposal_open_contract = false;

    get transactions() {
        return this.elements.filter(element => element.type === transaction_elements.CONTRACT);
    }

    onBotContractEvent(data) {
        this.pushTransaction(data);
    }

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

    setActiveTransactionId(transaction_id) {
        // Toggle transaction popover if passed transaction_id is the same.
        if (transaction_id && this.active_transaction_id === transaction_id) {
            this.active_transaction_id = null;
        } else {
            this.active_transaction_id = transaction_id;
        }
    }

    onClickOutsideTransaction(event) {
        const path = event.path || (event.composedPath && event.composedPath());
        const is_transaction_click = path.some(
            el => el.classList && el.classList.contains('transactions__item-wrapper')
        );
        if (!is_transaction_click) {
            this.setActiveTransactionId(null);
        }
    }

    onMount() {
        window.addEventListener('click', this.onClickOutsideTransaction);
        this.recoverPendingContracts();
    }

    onUnmount() {
        window.removeEventListener('click', this.onClickOutsideTransaction);
    }

    clear() {
        this.elements = this.elements.slice(0, 0);
        this.recovered_completed_transactions = this.recovered_completed_transactions.slice(0, 0);
        this.recovered_transactions = this.recovered_transactions.slice(0, 0);
    }

    registerReactions() {
        const { client } = this.core;

        // Write transactions to session storage on each change in transaction elements.
        const disposeTransactionElementsListener = reaction(
            () => this.elements,
            elements => {
                const stored_transactions = getStoredItemsByKey(this.TRANSACTION_CACHE, {});
                stored_transactions[client.loginid] = elements.slice(0, 5000);
                setStoredItemsByKey(this.TRANSACTION_CACHE, stored_transactions);
            }
        );

        // User could've left the page mid-contract. On initial load, try
        // to recover any pending contracts so we can reflect accurate stats
        // and transactions.
        const disposeRecoverContracts = reaction(
            () => this.transactions.length,
            () => this.recoverPendingContracts()
        );

        return () => {
            disposeTransactionElementsListener();
            disposeRecoverContracts();
        };
    }

    recoverPendingContracts() {
        this.transactions.forEach(({ data: trx }) => {
            if (trx.is_completed || this.recovered_transactions.includes(trx.contract_id)) return;
            this.recoverPendingContractsById(trx.contract_id);
        });
    }

    updateResultsCompletedContract(contract) {
        const { journal, summary_card } = this.root_store;
        const { contract_info } = summary_card;
        const { currency, profit } = contract;

        if (contract.contract_id !== contract_info?.contract_id) {
            this.onBotContractEvent(contract);

            if (!this.recovered_transactions.includes(contract.contract_id)) {
                this.recovered_transactions.push(contract.contract_id);
            }
            if (!this.recovered_completed_transactions.includes(contract.contract_id) && isEnded(contract)) {
                this.recovered_completed_transactions.push(contract.contract_id);

                journal.onLogSuccess({
                    log_type: profit > 0 ? log_types.PROFIT : log_types.LOST,
                    extra: { currency, profit },
                });
            }
        }
    }

    sortOutPositionsBeforeAction(positions, element_id = false) {
        positions.forEach(position => {
            if (!element_id || (element_id && position.id === element_id)) {
                const contract_details = position.contract_info;
                this.updateResultsCompletedContract(contract_details);
            }
        });
    }

    recoverPendingContractsById(contract_id) {
        const { ws } = this.root_store;
        const positions = this.core.portfolio.positions;

        // TODO: the idea is to remove the POC calls completely
        // but adding this check to prevent making POC calls only for bot as of now
        if (!isBot()) {
            ws.authorized.subscribeProposalOpenContract(contract_id, response => {
                this.is_called_proposal_open_contract = true;
                if (!response.error) {
                    const { proposal_open_contract } = response;
                    this.updateResultsCompletedContract(proposal_open_contract);
                }
            });
        }

        if (!this.is_called_proposal_open_contract) {
            if (!this.elements.length) {
                this.sortOutPositionsBeforeAction(positions);
            }
            if (this.elements.length && !this.elements[0].data.profit) {
                const element_id = this.elements[0].data.contract_id;
                this.sortOutPositionsBeforeAction(positions, element_id);
            }
        }
    }
}
