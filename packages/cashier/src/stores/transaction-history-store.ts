import { action, observable } from 'mobx';
import { isCryptocurrency } from '@deriv/shared';
import { TWebSocket, TRootStore, TServerError } from 'Types';

export type TTransactionItem = {
    address_hash: string;
    address_url: string;
    amount: number;
    id: string;
    is_valid_to_cancel: number;
    status_code: string;
    status_message: string;
    submit_date: number;
    transaction_type: string;
};

type TSubscribeCashierPayments = {
    error: TServerError;
    cashier_payments: { crypto: Array<TTransactionItem> };
};

export default class TransactionHistoryStore {
    // eslint-disable-next-line no-useless-constructor
    constructor(public WS: TWebSocket, public root_store: TRootStore) {}

    @observable crypto_transactions: Array<TTransactionItem> = [];
    @observable is_crypto_transactions_cancel_modal_visible = false;
    @observable is_crypto_transactions_status_modal_visible = false;
    @observable is_crypto_transactions_visible = false;
    @observable is_loading = false;
    @observable selected_crypto_transaction_id = '';
    @observable selected_crypto_status = '';
    @observable selected_crypto_status_description = '';

    @action.bound
    async onMount() {
        const { currency, switched } = this.root_store.client;
        const is_crypto = !!currency && isCryptocurrency(currency);

        if (is_crypto && !switched) {
            this.setLoading(true);
            await this.unsubscribeCryptoTransactions();
            await this.getCryptoTransactions();
            this.setLoading(false);
        }
    }

    @action.bound
    async unsubscribeCryptoTransactions() {
        await this.WS.authorized.cashierPayments?.({ provider: 'crypto', transaction_type: 'all' }).then(response => {
            if (!response.error) {
                const { crypto } = response.cashier_payments;
                this.setCryptoTransactionsHistory(crypto);
            }
        });
    }

    @action.bound
    async getCryptoTransactions(): Promise<void> {
        await this.WS.subscribeCashierPayments?.((response: TSubscribeCashierPayments) => {
            if (!response.error) {
                const { crypto } = response.cashier_payments;
                this.updateCryptoTransactions(crypto);
            }
        });
    }

    @action.bound
    setCryptoTransactionsHistory(transactions: Array<TTransactionItem>): void {
        this.crypto_transactions = transactions;
        this.sortCryptoTransactions();
    }

    @action.bound
    updateCryptoTransactions(transactions: Array<TTransactionItem>): void {
        transactions.forEach(transaction => {
            const index = this.crypto_transactions.findIndex(crypto => crypto.id === transaction.id);
            if (index === -1) {
                this.crypto_transactions.push(transaction);
            } else {
                Object.assign(this.crypto_transactions[index], transaction);
            }
        });
        this.sortCryptoTransactions();
    }

    @action.bound
    sortCryptoTransactions(): void {
        this.crypto_transactions = this.crypto_transactions.slice().sort((a, b) => b.submit_date - a.submit_date);
    }

    @action.bound
    async cancelCryptoTransaction(transaction_id: string): Promise<void> {
        await this.WS.cancelCryptoTransaction?.(transaction_id).then(response => {
            if (!response.error) {
                this.setSelectedCryptoTransactionId('');
                this.setIsCryptoTransactionsCancelModalVisible(false);
                return Promise.resolve(response);
            }
            return Promise.reject(response.error);
        });
    }

    @action.bound
    setSelectedCryptoTransactionId(id: string): void {
        this.selected_crypto_transaction_id = id;
    }

    @action.bound
    setIsCryptoTransactionsCancelModalVisible(is_visible: boolean): void {
        this.is_crypto_transactions_cancel_modal_visible = is_visible;
    }

    @action.bound
    showCryptoTransactionsCancelModal(id: string): void {
        this.setSelectedCryptoTransactionId(id);
        this.setIsCryptoTransactionsCancelModalVisible(true);
    }

    @action.bound
    hideCryptoTransactionsCancelModal(): void {
        this.setSelectedCryptoTransactionId('');
        this.setIsCryptoTransactionsCancelModalVisible(false);
    }

    @action.bound
    setSelectedCryptoStatus(status: string): void {
        this.selected_crypto_status = status;
    }

    @action.bound
    setSelectedCryptoStatusDescription(description: string): void {
        this.selected_crypto_status_description = description;
    }

    @action.bound
    setIsCryptoTransactionsStatusModalVisible(is_visible: boolean): void {
        this.is_crypto_transactions_status_modal_visible = is_visible;
    }

    @action.bound
    showCryptoTransactionsStatusModal(description: string, name: string): void {
        this.setSelectedCryptoStatusDescription(description);
        this.setSelectedCryptoStatus(name);
        this.setIsCryptoTransactionsStatusModalVisible(true);
    }

    @action.bound
    hideCryptoTransactionsStatusModal(): void {
        this.setIsCryptoTransactionsStatusModalVisible(false);
    }

    @action.bound
    setLoading(is_loading: boolean): void {
        this.is_loading = is_loading;
    }

    @action.bound
    setIsCryptoTransactionsVisible(is_visible: boolean): void {
        this.is_crypto_transactions_visible = is_visible;
    }
}
