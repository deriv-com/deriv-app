import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { log_types } from '@deriv/bot-skeleton';
import { formatDate, isEnded } from '@deriv/shared';
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
            is_transaction_details_modal_open: observable,
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
            toggleTransactionDetailsModal: action.bound,
        });

        this.is_transaction_details_modal_open = false;
        this.root_store = root_store;
        this.core = core;
        this.disposeReactionsFn = this.registerReactions();
    }
    TRANSACTION_CACHE = 'transaction_cache';

    elements = getStoredItemsByUser(this.TRANSACTION_CACHE, this.core?.client?.loginid, []);
    active_transaction_id = null;
    recovered_completed_transactions = [];
    recovered_transactions = [];
    is_called_proposal_open_contract = false;
    is_transaction_details_modal_open = false;

    get transactions() {
        return (
            this.elements[this.core?.client?.loginid]?.filter(
                element => element.type === transaction_elements.CONTRACT
            ) ?? []
        );
    }

    get statistics() {
        let total_runs = 0;
        const statistics = this.transactions.reduce(
            (stats, { data: trx }) => {
                if (trx.is_completed) {
                    if (trx.profit > 0) {
                        stats.won_contracts += 1;
                        stats.total_payout += trx.payout;
                    } else {
                        stats.lost_contracts += 1;
                    }

                    stats.total_profit += trx.profit;
                    stats.total_stake += trx.buy_price;
                    total_runs += 1;
                }

                return stats;
            },
            {
                lost_contracts: 0,
                number_of_runs: 0,
                total_profit: 0,
                total_payout: 0,
                total_stake: 0,
                won_contracts: 0,
            }
        );
        statistics.number_of_runs = total_runs;
        return statistics;
    }

    toggleTransactionDetailsModal(is_open) {
        this.is_transaction_details_modal_open = is_open;
    }

    onBotContractEvent(data) {
        this.pushTransaction(data);
    }

    pushTransaction(data) {
        const is_completed = isEnded(data);
        const { run_id } = this.root_store.run_panel;
        const current_account = this.core?.client?.loginid;
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

        if (!this.elements[current_account]) {
            this.elements = {
                ...this.elements,
                [current_account]: [],
            };
        }

        const same_contract_index = this.elements[current_account]?.findIndex(
            c =>
                c.type === transaction_elements.CONTRACT &&
                c.data.transaction_ids &&
                c.data.transaction_ids.buy === data.transaction_ids.buy
        );

        if (same_contract_index === -1) {
            // Render a divider if the "run_id" for this contract is different.
            if (this.elements[current_account]?.length > 0) {
                const is_new_run =
                    this.elements[current_account]?.[0].type === transaction_elements.CONTRACT &&
                    contract.run_id !== this.elements[current_account]?.[0].data.run_id;

                if (is_new_run) {
                    this.elements[current_account]?.unshift({
                        type: transaction_elements.DIVIDER,
                        data: contract.run_id,
                    });
                }
            }

            this.elements[current_account]?.unshift({
                type: transaction_elements.CONTRACT,
                data: contract,
            });
        } else {
            // If data belongs to existing contract in memory, update it.
            this.elements[current_account]?.splice(same_contract_index, 1, {
                type: transaction_elements.CONTRACT,
                data: contract,
            });
        }

        this.elements = { ...this.elements }; // force update
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
        this.elements[this.core?.client?.loginid] = [];
        this.recovered_completed_transactions = this.recovered_completed_transactions?.slice(0, 0);
        this.recovered_transactions = this.recovered_transactions?.slice(0, 0);
        this.is_transaction_details_modal_open = false;
    }

    registerReactions() {
        const { client } = this.core;

        // Write transactions to session storage on each change in transaction elements.
        const disposeTransactionElementsListener = reaction(
            () => this.elements[client?.loginid],
            elements => {
                const stored_transactions = getStoredItemsByKey(this.TRANSACTION_CACHE, {});
                stored_transactions[client.loginid] = elements?.slice(0, 5000) ?? [];
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

    recoverPendingContracts(contract = null) {
        this.transactions.forEach(({ data: trx }) => {
            if (trx.is_completed || this.recovered_transactions.includes(trx.contract_id)) return;
            this.recoverPendingContractsById(trx.contract_id, contract);
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
        positions?.forEach(position => {
            if (!element_id || (element_id && position.id === element_id)) {
                const contract_details = position.contract_info;
                this.updateResultsCompletedContract(contract_details);
            }
        });
    }

    recoverPendingContractsById(contract_id, contract = null) {
        const positions = this.core.portfolio.positions;

        if (contract) {
            this.is_called_proposal_open_contract = true;
            if (contract.contract_id === contract_id) {
                this.updateResultsCompletedContract(contract);
            }
        }

        if (!this.is_called_proposal_open_contract) {
            const current_account = this.core?.client?.loginid;
            if (!this.elements[current_account]?.length) {
                this.sortOutPositionsBeforeAction(positions);
            }
            if (this.elements[current_account]?.length && !this.elements[current_account]?.[0]?.data?.profit) {
                const element_id = this.elements[current_account]?.[0].data.contract_id;
                this.sortOutPositionsBeforeAction(positions, element_id);
            }
        }
    }
}
