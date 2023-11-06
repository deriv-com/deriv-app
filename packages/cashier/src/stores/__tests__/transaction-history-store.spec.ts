import TransactionHistoryStore from '../transaction-history-store';
import { configure } from 'mobx';
import { mockStore } from '@deriv/stores';
import type { TRootStore, TWebSocket } from '../../types';

configure({ safeDescriptors: false });

describe('TransactionHistoryStore', () => {
    let transaction_history_store: TransactionHistoryStore;

    const root_store = mockStore({
        client: {
            currency: 'BTC',
            switched: false,
        },
    });
    const WS: DeepPartial<TWebSocket> = {
        cancelCryptoTransaction: jest.fn(() => Promise.resolve({})),
    };

    beforeEach(() => {
        transaction_history_store = new TransactionHistoryStore(WS as TWebSocket, root_store as TRootStore);
    });

    it('should cancel a crypto transaction', async () => {
        await transaction_history_store.cancelCryptoTransaction('175');
        expect(transaction_history_store.selected_crypto_transaction_id).toBeFalsy();
        expect(transaction_history_store.is_transactions_crypto_cancel_modal_visible).toBeFalsy();
    });

    it('should not proceed with the cancellation of a crypto transaction if there is an error', async () => {
        const spySetIsTransactionsCryptoCancelModalVisible = jest.spyOn(
            transaction_history_store,
            'setIsTransactionsCryptoCancelModalVisible'
        );
        const spySetSelectedCryptoTransactionId = jest.spyOn(
            transaction_history_store,
            'setSelectedCryptoTransactionId'
        );

        try {
            (transaction_history_store.WS.cancelCryptoTransaction as jest.Mock).mockResolvedValue(
                Promise.resolve({ error: 'error' })
            );
            await transaction_history_store.cancelCryptoTransaction('175');
        } catch (e) {
            expect(spySetIsTransactionsCryptoCancelModalVisible).not.toHaveBeenCalled();
            expect(spySetSelectedCryptoTransactionId).not.toHaveBeenCalled();
        }
    });

    it('should set selected crypto transaction id', () => {
        transaction_history_store.setSelectedCryptoTransactionId('1');
        expect(transaction_history_store.selected_crypto_transaction_id).toBe('1');
    });

    it('should set crypto transactions cancel modal visibility', () => {
        transaction_history_store.setIsTransactionsCryptoCancelModalVisible(true);
        expect(transaction_history_store.is_transactions_crypto_cancel_modal_visible).toBe(true);

        transaction_history_store.setIsTransactionsCryptoCancelModalVisible(false);
        expect(transaction_history_store.is_transactions_crypto_cancel_modal_visible).toBe(false);
    });

    it('should show crypto transactions cancel modal', () => {
        transaction_history_store.showTransactionsCryptoCancelModal('1');
        expect(transaction_history_store.selected_crypto_transaction_id).toBe('1');
        expect(transaction_history_store.is_transactions_crypto_cancel_modal_visible).toBe(true);
    });

    it('should hide crypto transactions cancel modal', () => {
        transaction_history_store.hideTransactionsCryptoCancelModal();
        expect(transaction_history_store.selected_crypto_transaction_id).toBeFalsy();
        expect(transaction_history_store.is_transactions_crypto_cancel_modal_visible).toBe(false);
    });

    it('should set selected crypto transaction status', () => {
        transaction_history_store.setSelectedCryptoStatus('Successful');
        expect(transaction_history_store.selected_crypto_status).toBe('Successful');
    });

    it('should set selected crypto transaction description', () => {
        transaction_history_store.setSelectedCryptoStatusDescription('Your deposit is successful.');
        expect(transaction_history_store.selected_crypto_status_description).toBe('Your deposit is successful.');
    });

    it('should set crypto transactions status modal visibility', () => {
        transaction_history_store.setIsTransactionsCryptoStatusModalVisible(true);
        expect(transaction_history_store.is_transactions_crypto_status_modal_visible).toBe(true);

        transaction_history_store.setIsTransactionsCryptoStatusModalVisible(false);
        expect(transaction_history_store.is_transactions_crypto_status_modal_visible).toBe(false);
    });

    it('should show crypto transactions status modal', () => {
        transaction_history_store.showTransactionsCryptoStatusModal(
            'We’ve received your request and are waiting for more blockchain confirmations.',
            'In process'
        );
        expect(transaction_history_store.selected_crypto_status).toBe('In process');
        expect(transaction_history_store.selected_crypto_status_description).toBe(
            'We’ve received your request and are waiting for more blockchain confirmations.'
        );
        expect(transaction_history_store.is_transactions_crypto_status_modal_visible).toBe(true);
    });

    it('should hide crypto transactions status modal', () => {
        transaction_history_store.hideTransactionsCryptoStatusModal();
        expect(transaction_history_store.is_transactions_crypto_status_modal_visible).toBe(false);
    });

    it('should set crypto transactions visibility', () => {
        transaction_history_store.setIsTransactionsCryptoVisible(true);
        expect(transaction_history_store.is_transactions_crypto_visible).toBe(true);

        transaction_history_store.setIsTransactionsCryptoVisible(false);
        expect(transaction_history_store.is_transactions_crypto_visible).toBe(false);
    });
});
