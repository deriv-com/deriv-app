import { action, observable, makeObservable } from 'mobx';
import type { TWebSocket, TRootStore } from '../types';

export default class TransactionHistoryStore {
    constructor(public WS: TWebSocket, public root_store: TRootStore) {
        makeObservable(this, {
            is_crypto_transactions_cancel_modal_visible: observable,
            is_crypto_transactions_status_modal_visible: observable,
            is_crypto_transactions_visible: observable,
            selected_crypto_transaction_id: observable,
            selected_crypto_status: observable,
            selected_crypto_status_description: observable,
            cancelCryptoTransaction: action.bound,
            setSelectedCryptoTransactionId: action.bound,
            setIsCryptoTransactionsCancelModalVisible: action.bound,
            showCryptoTransactionsCancelModal: action.bound,
            hideCryptoTransactionsCancelModal: action.bound,
            setSelectedCryptoStatus: action.bound,
            setSelectedCryptoStatusDescription: action.bound,
            setIsCryptoTransactionsStatusModalVisible: action.bound,
            showCryptoTransactionsStatusModal: action.bound,
            hideCryptoTransactionsStatusModal: action.bound,
            setIsCryptoTransactionsVisible: action.bound,
        });
    }
    is_crypto_transactions_cancel_modal_visible = false;
    is_crypto_transactions_status_modal_visible = false;
    is_crypto_transactions_visible = false;
    selected_crypto_transaction_id = '';
    selected_crypto_status = '';
    selected_crypto_status_description: JSX.Element | string = '';

    async cancelCryptoTransaction(transaction_id: string) {
        await this.WS.cancelCryptoTransaction?.(transaction_id).then(response => {
            if (!response.error) {
                this.setSelectedCryptoTransactionId('');
                this.setIsCryptoTransactionsCancelModalVisible(false);
                return Promise.resolve(response);
            }
            return Promise.reject(response.error);
        });
    }

    setSelectedCryptoTransactionId(id: string): void {
        this.selected_crypto_transaction_id = id;
    }

    setIsCryptoTransactionsCancelModalVisible(is_visible: boolean): void {
        this.is_crypto_transactions_cancel_modal_visible = is_visible;
    }

    showCryptoTransactionsCancelModal(id: string): void {
        this.setSelectedCryptoTransactionId(id);
        this.setIsCryptoTransactionsCancelModalVisible(true);
    }

    hideCryptoTransactionsCancelModal(): void {
        this.setSelectedCryptoTransactionId('');
        this.setIsCryptoTransactionsCancelModalVisible(false);
    }

    setSelectedCryptoStatus(status: string): void {
        this.selected_crypto_status = status;
    }

    setSelectedCryptoStatusDescription(description: JSX.Element | string): void {
        this.selected_crypto_status_description = description;
    }

    setIsCryptoTransactionsStatusModalVisible(is_visible: boolean): void {
        this.is_crypto_transactions_status_modal_visible = is_visible;
    }

    showCryptoTransactionsStatusModal(description: JSX.Element | string, name: string): void {
        this.setSelectedCryptoStatusDescription(description);
        this.setSelectedCryptoStatus(name);
        this.setIsCryptoTransactionsStatusModalVisible(true);
    }

    hideCryptoTransactionsStatusModal() {
        this.setIsCryptoTransactionsStatusModalVisible(false);
    }

    setIsCryptoTransactionsVisible(is_visible: boolean): void {
        this.is_crypto_transactions_visible = is_visible;
    }
}
