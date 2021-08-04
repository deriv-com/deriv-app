import { action, observable } from 'mobx';

export default class TransactionHistoryStore {
    constructor(WS) {
        this.WS = WS;
    }
    @observable crypto_transactions = [];

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
}
