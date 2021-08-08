import { action, observable } from 'mobx';

export default class TransactionHistoryStore {
    constructor(WS) {
        this.WS = WS;
    }
    @observable crypto_transactions = [];
    @observable is_crypto_transactions_cancel_modal_visible = false;
    @observable is_crypto_transactions_status_modal_visible = false;
    @observable is_crypto_transactions_visible = false;
    @observable is_loading = false;
    @observable selected_crypto_transaction_id = '';
    @observable selected_crypto_status = '';
    @observable selected_crypto_status_description = '';

    @action.bound setCryptoTransactionsHistory(transactions) {
        this.crypto_transactions = transactions;
    }
    @action.bound
    async getCryptoTransactions() {
        await this.WS.cashierPayments('crypto', 'all').then(response => {
            if (!response.error) {
                const { crypto } = response.cashier_payments;
                this.setCryptoTransactionsHistory(crypto);
                return Promise.resolve(response);
            }
            return Promise.reject(response.error);
        });
    }
    @action.bound
    onMount() {
        this.getCryptoTransactions();
    }

    @action.bound
    async onMountCryptoTransactionsHistory() {
        this.setLoading(true);
        await this.getCryptoTransactions();
        this.setLoading(false);
    }

    @action.bound
    async cancelCryptoTransaction(transaction_id) {
        await this.WS.cancelCryptoTransaction(transaction_id).then(response => {
            if (!response.error) {
                this.getCryptoTransactions();
                this.setSelectedCryptoTransactionId('');
                this.setIsCryptoTransactionsCancelModalVisible(false);
                return Promise.resolve(response);
            }
            return Promise.reject(response.error);
        });
    }

    @action.bound
    setSelectedCryptoTransactionId(id) {
        this.selected_crypto_transaction_id = id;
    }

    @action.bound
    setIsCryptoTransactionsCancelModalVisible(is_visible) {
        this.is_crypto_transactions_cancel_modal_visible = is_visible;
    }

    @action.bound
    showCryptoTransactionsCancelModal(id) {
        this.setSelectedCryptoTransactionId(id);
        this.setIsCryptoTransactionsCancelModalVisible(true);
    }

    @action.bound
    hideCryptoTransactionsCancelModal() {
        this.setSelectedCryptoTransactionId('');
        this.setIsCryptoTransactionsCancelModalVisible(false);
    }

    @action.bound
    setSelectedCryptoStatus(status) {
        this.selected_crypto_status = status;
    }

    @action.bound
    setSelectedCryptoStatusDescription(description) {
        this.selected_crypto_status_description = description;
    }

    @action.bound
    setIsCryptoTransactionsStatusModalVisible(is_visible) {
        this.is_crypto_transactions_status_modal_visible = is_visible;
    }

    @action.bound
    showCryptoTransactionsStatusModal(description, name) {
        this.setSelectedCryptoStatusDescription(description);
        this.setSelectedCryptoStatus(name);
        this.setIsCryptoTransactionsStatusModalVisible(true);
    }

    @action.bound
    hideCryptoTransactionsStatusModal() {
        this.setIsCryptoTransactionsStatusModalVisible(false);
    }

    @action.bound
    setLoading(is_loading) {
        this.is_loading = is_loading;
    }

    @action.bound
    setIsCryptoTransactionsVisible(is_visible) {
        this.is_crypto_transactions_visible = is_visible;
    }
}
