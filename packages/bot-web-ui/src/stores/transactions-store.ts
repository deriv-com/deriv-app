import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { ProposalOpenContract } from '@deriv/api-types';
import { LogTypes } from '@deriv/bot-skeleton';
import { formatDate, isEnded } from '@deriv/shared';
import { TStores } from '@deriv/stores/types';
import { TContractInfo } from 'Components/summary/summary-card.types';
import { TStatistics } from 'Components/transaction-details/transaction-details.types';
import { transaction_elements } from '../constants/transactions';
import { getStoredItemsByKey, getStoredItemsByUser, setStoredItemsByKey } from '../utils/session-storage';
import RootStore from './root-store';

type TTransactionInfo = {
    data: TContractInfo;
    type: 'contract' | 'divider';
    loginid?: string;
};

type TElements = {
    [key: string]: TTransactionInfo[];
};

interface ITransactionsStore {
    TRANSACTION_CACHE: string;
    elements: TElements;
    active_transaction_id: number | null;
    recovered_completed_transactions: number[];
    recovered_transactions: Array<number>;
    is_called_proposal_open_contract: boolean;
    is_transaction_details_modal_open: boolean;
    transactions: TTransactionInfo[];
    onBotContractEvent: (data: ProposalOpenContract) => void;
    pushTransaction: (data: ProposalOpenContract) => void;
    onClickOutsideTransaction: (event: MouseEvent) => void;
    onMount: () => void;
    onUnmount: () => void;
    clear: () => void;
    setActiveTransactionId: (transaction_id: number | null) => void;
    registerReactions: () => void;
    recoverPendingContracts: (contract?: ProposalOpenContract) => void;
    updateResultsCompletedContract: (contract: ProposalOpenContract) => void;
    sortOutPositionsBeforeAction: (positions: TContractInfo[], element_id?: string) => void;
    recoverPendingContractsById: (contract_id: number, contract?: ProposalOpenContract) => void;
    toggleTransactionDetailsModal: (is_open: boolean) => void;
}

export default class TransactionsStore implements ITransactionsStore {
    root_store: RootStore;
    core: TStores | null = null;
    disposeReactionsFn;

    constructor(root_store: RootStore, core: TStores | null) {
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

    elements: TElements = getStoredItemsByUser(this.TRANSACTION_CACHE, this.core?.client?.loginid, []);
    active_transaction_id: number | null = null;
    recovered_completed_transactions: number[] = [];
    recovered_transactions: number[] = [];
    is_called_proposal_open_contract = false;
    is_transaction_details_modal_open = false;

    get transactions() {
        if (this.core?.client?.loginid) {
            return (
                this.elements[this.core?.client?.loginid]?.filter(
                    (element: TTransactionInfo) => element.type === transaction_elements.CONTRACT
                ) ?? []
            );
        }
        return [];
    }

    get statistics() {
        let total_runs = 0;
        const statistics = this.transactions.reduce(
            (stats: TStatistics, { data: trx }: { data: TContractInfo }) => {
                if (trx.is_completed && trx.profit !== undefined) {
                    if (trx.profit > 0) {
                        stats.won_contracts += 1;
                        stats.total_payout += trx.payout ?? 0;
                    } else {
                        stats.lost_contracts += 1;
                    }

                    stats.total_profit += trx.profit;
                    stats.total_stake += trx.buy_price ?? 0;
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

    toggleTransactionDetailsModal(is_open: boolean) {
        this.is_transaction_details_modal_open = is_open;
    }

    onBotContractEvent(data: ProposalOpenContract) {
        this.pushTransaction(data);
    }

    pushTransaction(data: ProposalOpenContract) {
        const is_completed = isEnded(data);
        const { run_id } = this.root_store.run_panel;
        const current_account = this.core?.client?.loginid ?? '';
        const contract: TContractInfo = {
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
            profit: is_completed ? data.profit : 0,
            run_id,
            shortcode: data.shortcode,
            tick_count: data.tick_count,
            transaction_ids: data.transaction_ids,
            underlying: data.underlying,
        };

        if (!this.elements[current_account]) {
            this.elements[current_account] = [];
        }

        const same_contract_index = this.elements[current_account]?.findIndex(
            c =>
                c.type === transaction_elements.CONTRACT &&
                typeof c.data !== 'string' &&
                c.data.transaction_ids &&
                c.data.transaction_ids.buy === data?.transaction_ids?.buy
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
                        // Need to fix this data type as currently it's holding both string and object.
                        data: contract.run_id as unknown as TContractInfo,
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

    setActiveTransactionId(transaction_id: number | null) {
        // Toggle transaction popover if passed transaction_id is the same.
        if (transaction_id && this.active_transaction_id === transaction_id) {
            this.active_transaction_id = null;
        } else {
            this.active_transaction_id = transaction_id;
        }
    }

    onClickOutsideTransaction(event: MouseEvent) {
        const path = event.composedPath?.();
        const is_transaction_click = path?.some(
            (el: EventTarget | null) => el instanceof Element && el.classList?.contains('transactions__item-wrapper')
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
        if (this.core?.client?.loginid) {
            this.elements[this.core?.client?.loginid] = [];
        }
        this.recovered_completed_transactions = this.recovered_completed_transactions?.slice(0, 0);
        this.recovered_transactions = this.recovered_transactions?.slice(0, 0);
        this.is_transaction_details_modal_open = false;
    }

    registerReactions() {
        if (!this?.core) return;
        const { client } = this?.core;

        // Write transactions to session storage on each change in transaction elements.
        const disposeTransactionElementsListener = reaction(
            () => this.elements[client?.loginid ?? ''],
            elements => {
                const stored_transactions = getStoredItemsByKey(this.TRANSACTION_CACHE, {});
                if (client?.loginid) {
                    stored_transactions[client?.loginid] = elements?.slice(0, 5000) ?? [];
                }
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

    recoverPendingContracts(contract?: ProposalOpenContract) {
        this.transactions.forEach(({ data: trx }: { data: TContractInfo }) => {
            if (trx.is_completed) return;
            if (trx.contract_id) {
                if (this.recovered_transactions.includes(trx.contract_id)) return;
                this.recoverPendingContractsById(trx.contract_id, contract);
            }
        });
    }

    updateResultsCompletedContract(contract: ProposalOpenContract | null | undefined) {
        if (!contract) return;
        const { journal, summary_card } = this.root_store;
        const { contract_info } = summary_card;
        const { currency, profit, contract_id } = contract;

        if (contract_id !== contract_info?.contract_id) {
            this.onBotContractEvent(contract);

            if (contract_id && !this.recovered_transactions?.includes(contract_id)) {
                this.recovered_transactions.push(contract_id);
            }
            if (contract_id && !this.recovered_completed_transactions.includes(contract_id) && isEnded(contract)) {
                this.recovered_completed_transactions.push(contract_id);

                journal.onLogSuccess({
                    log_type: Number(profit) > 0 ? LogTypes.PROFIT : LogTypes.LOST,
                    extra: { currency, profit },
                });
            }
        }
    }

    sortOutPositionsBeforeAction(positions: TContractInfo[], element_id?: string) {
        positions?.forEach(position => {
            if (!element_id || (element_id && position.id === element_id)) {
                const contract_details = position.contract_info;
                this.updateResultsCompletedContract(contract_details);
            }
        });
    }

    recoverPendingContractsById(contract_id: number, contract?: ProposalOpenContract) {
        const positions = this.core?.portfolio.positions;

        if (contract) {
            this.is_called_proposal_open_contract = true;
            if (contract.contract_id === contract_id) {
                this.updateResultsCompletedContract(contract);
            }
        }

        if (!this.is_called_proposal_open_contract && positions?.length) {
            const current_account = this.core?.client?.loginid ?? '';
            if (!this.elements[current_account]?.length) {
                this.sortOutPositionsBeforeAction(positions as unknown as TContractInfo[]);
            }
            if (this.elements[current_account]?.length && !this.elements[current_account]?.[0]?.data?.profit) {
                const element_id = this.elements[current_account]?.[0].data.contract_id;
                this.sortOutPositionsBeforeAction(positions as unknown as TContractInfo[], element_id?.toString());
            }
        }
    }
}
