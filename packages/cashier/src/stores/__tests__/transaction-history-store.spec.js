import TransactionHistoryStore from '../transaction-history-store';

describe('TransactionHistoryStore', () => {
    let transaction_history_store;
    const crypto_transactions = [
        {
            address_hash: 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
            address_url: 'https://www.blockchain.com/btc-testnet/address/tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
            amount: 0.0005531,
            id: '175',
            is_valid_to_cancel: 1,
            status_code: 'LOCKED',
            status_message:
                'We`re reviewing your withdrawal request. You may still cancel this transaction if you wish. Once we start processing, you won`t be able to cancel.',
            submit_date: 1648811322,
            transaction_type: 'withdrawal',
        },
    ];
    const root_store = {
        client: {
            currency: 'BTC',
            switched: false,
        },
    };
    const WS = {
        authorized: {
            cashierPayments: () =>
                Promise.resolve({
                    cashier_payments: { crypto: crypto_transactions },
                }),
        },
        subscribeCashierPayments: cb =>
            cb({
                cashier_payments: { crypto: crypto_transactions },
            }),
        cancelCryptoTransaction: jest.fn(() => Promise.resolve({})),
    };

    beforeEach(() => {
        transaction_history_store = new TransactionHistoryStore({ WS, root_store });
    });

    it('should load crypto transactions properly', async () => {
        await transaction_history_store.onMount();
        expect(transaction_history_store.crypto_transactions).toEqual(crypto_transactions);
    });

    it('should subscribe to crypto transactions', async () => {
        const spyUpdateCryptoTransactions = jest.spyOn(transaction_history_store, 'updateCryptoTransactions');

        await transaction_history_store.getCryptoTransactions();
        expect(spyUpdateCryptoTransactions).toHaveBeenCalledWith(crypto_transactions);
        expect(transaction_history_store.crypto_transactions).toEqual(crypto_transactions);
    });

    it('should update the list of crypto transactions if there is a new crypto transaction or an update with an existing transaction', () => {
        const updated_crypto_transactions = [
            {
                address_hash: 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
                address_url:
                    'https://www.blockchain.com/btc-testnet/address/tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
                amount: 0.0005531,
                id: '175',
                is_valid_to_cancel: 0,
                status_code: 'CANCELLED',
                status_message: 'You’ve cancelled your withdrawal request.',
                submit_date: 1649048412,
                transaction_type: 'withdrawal',
            },
            {
                address_hash: 'tb1ql7w62elx9ucw4pj1lgw4l028hmuw80sndtntxt',
                address_url:
                    'https://www.blockchain.com/btc-testnet/address/tb1ql7w62elx9ucw4pj1lgw4l028hmuw80sndtntxt',
                amount: 0.0005531,
                id: '176',
                is_valid_to_cancel: 1,
                status_code: 'LOCKED',
                status_message:
                    'We`re reviewing your withdrawal request. You may still cancel this transaction if you wish. Once we start processing, you won`t be able to cancel.',
                submit_date: 1649048412,
                transaction_type: 'withdrawal',
            },
        ];

        transaction_history_store.updateCryptoTransactions(updated_crypto_transactions);
        expect(transaction_history_store.crypto_transactions).toEqual(updated_crypto_transactions);
    });

    it('should cancel a crypto transaction', async () => {
        await transaction_history_store.cancelCryptoTransaction('175');
        expect(transaction_history_store.selected_crypto_transaction_id).toBeFalsy();
        expect(transaction_history_store.is_crypto_transactions_cancel_modal_visible).toBeFalsy();
    });

    it('should not proceed with the cancellation of a crypto transaction if there is an error', async () => {
        const spySetIsCryptoTransactionsCancelModalVisible = jest.spyOn(
            transaction_history_store,
            'setIsCryptoTransactionsCancelModalVisible'
        );
        const spySetSelectedCryptoTransactionId = jest.spyOn(
            transaction_history_store,
            'setSelectedCryptoTransactionId'
        );

        try {
            transaction_history_store.WS.cancelCryptoTransaction.mockResolvedValue(Promise.resolve({ error: 'error' }));
            await transaction_history_store.cancelCryptoTransaction('175');
        } catch (e) {
            expect(spySetIsCryptoTransactionsCancelModalVisible).not.toHaveBeenCalled();
            expect(spySetSelectedCryptoTransactionId).not.toHaveBeenCalled();
        }
    });

    it('should set selected crypto transaction id', () => {
        transaction_history_store.setSelectedCryptoTransactionId('1');
        expect(transaction_history_store.selected_crypto_transaction_id).toBe('1');
    });

    it('should set crypto transactions cancel modal visibility', () => {
        transaction_history_store.setIsCryptoTransactionsCancelModalVisible(true);
        expect(transaction_history_store.is_crypto_transactions_cancel_modal_visible).toBe(true);

        transaction_history_store.setIsCryptoTransactionsCancelModalVisible(false);
        expect(transaction_history_store.is_crypto_transactions_cancel_modal_visible).toBe(false);
    });

    it('should show crypto transactions cancel modal', () => {
        transaction_history_store.showCryptoTransactionsCancelModal('1');
        expect(transaction_history_store.selected_crypto_transaction_id).toBe('1');
        expect(transaction_history_store.is_crypto_transactions_cancel_modal_visible).toBe(true);
    });

    it('should hide crypto transactions cancel modal', () => {
        transaction_history_store.hideCryptoTransactionsCancelModal();
        expect(transaction_history_store.selected_crypto_transaction_id).toBeFalsy();
        expect(transaction_history_store.is_crypto_transactions_cancel_modal_visible).toBe(false);
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
        transaction_history_store.setIsCryptoTransactionsStatusModalVisible(true);
        expect(transaction_history_store.is_crypto_transactions_status_modal_visible).toBe(true);

        transaction_history_store.setIsCryptoTransactionsStatusModalVisible(false);
        expect(transaction_history_store.is_crypto_transactions_status_modal_visible).toBe(false);
    });

    it('should show crypto transactions status modal', () => {
        transaction_history_store.showCryptoTransactionsStatusModal(
            'We’ve received your request and are waiting for more blockchain confirmations.',
            'In process'
        );
        expect(transaction_history_store.selected_crypto_status).toBe('In process');
        expect(transaction_history_store.selected_crypto_status_description).toBe(
            'We’ve received your request and are waiting for more blockchain confirmations.'
        );
        expect(transaction_history_store.is_crypto_transactions_status_modal_visible).toBe(true);
    });

    it('should hide crypto transactions status modal', () => {
        transaction_history_store.hideCryptoTransactionsStatusModal();
        expect(transaction_history_store.is_crypto_transactions_status_modal_visible).toBe(false);
    });

    it('should set is_loading indicator', () => {
        transaction_history_store.setLoading(true);
        expect(transaction_history_store.is_loading).toBe(true);

        transaction_history_store.setLoading(false);
        expect(transaction_history_store.is_loading).toBe(false);
    });

    it('should set crypto transactions visibility', () => {
        transaction_history_store.setIsCryptoTransactionsVisible(true);
        expect(transaction_history_store.is_crypto_transactions_visible).toBe(true);

        transaction_history_store.setIsCryptoTransactionsVisible(false);
        expect(transaction_history_store.is_crypto_transactions_visible).toBe(false);
    });
});
