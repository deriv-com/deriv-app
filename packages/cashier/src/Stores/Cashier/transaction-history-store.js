import { action, observable } from 'mobx';
import { WS } from '@deriv/shared';

export default class TransactionHistoryStore {
    @observable crypto_transactions = [];

    @action.bound setCryptoTransactionsHistory(transactions) {
        this.crypto_transactions = transactions;
    }

    @action.bound
    async getCryptoTransactions() {
        await WS.cashier_payments().then(response => {
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
