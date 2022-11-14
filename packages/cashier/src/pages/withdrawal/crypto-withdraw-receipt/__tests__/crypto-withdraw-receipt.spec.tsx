import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CryptoWithdrawReceipt from '../crypto-withdraw-receipt';
import { StoreProvider } from '../../../../hooks';

describe('<CryptoWithdrawReceipt />', () => {
    let mockRootStore;
    beforeEach(() => {
        mockRootStore = {
            client: {
                currency: 'BTC',
            },
            modules: {
                cashier: {
                    account_transfer: {
                        selected_from: {
                            balance: '1.00000000',
                            currency: 'BTC',
                            is_crypto: true,
                            is_dxtrade: false,
                            is_mt: false,
                            text: 'BTC',
                            value: 'CR90000118',
                        },
                    },
                    general_store: {
                        percentageSelectorSelectionStatus: jest.fn(),
                    },
                    transaction_history: {
                        onMount: jest.fn(),
                        setIsCryptoTransactionsVisible: jest.fn(),
                    },
                    withdraw: {
                        blockchain_address: 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
                        resetWithrawForm: jest.fn(),
                        setIsWithdrawConfirmed: jest.fn(),
                        withdraw_amount: 0.0002,
                    },
                },
            },
        };
    });

    const renderCryptoWithdrawReceipt = () => {
        return render(
            <StoreProvider store={mockRootStore}>
                <CryptoWithdrawReceipt />
            </StoreProvider>
        );
    };

    it('should show the proper text/messages', () => {
        renderCryptoWithdrawReceipt();

        expect(screen.getByText('Your withdrawal will be processed within 24 hours')).toBeInTheDocument();
        expect(screen.getByText('In review')).toBeInTheDocument();
        expect(screen.getByText('0.0002 BTC')).toBeInTheDocument();
        expect(screen.getByText('BTC')).toBeInTheDocument();
        expect(screen.getByText('CR90000118')).toBeInTheDocument();
        expect(screen.getByText('BTC wallet')).toBeInTheDocument();
        expect(screen.getByText('tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt')).toBeInTheDocument();
        expect(screen.getByText('View transaction history')).toBeInTheDocument();
        expect(screen.getByText('Make a new withdrawal')).toBeInTheDocument();
    });

    it('should trigger onClick callback when the "View transaction history" button is clicked', () => {
        renderCryptoWithdrawReceipt();

        const view_transaction_history_btn = screen.getByText('View transaction history');
        fireEvent.click(view_transaction_history_btn);
        expect(mockRootStore.modules.cashier.transaction_history.setIsCryptoTransactionsVisible).toHaveBeenCalledTimes(
            1
        );
    });

    it('should trigger onClick callback when the "Make a new withdrawal" button is clicked', () => {
        renderCryptoWithdrawReceipt();

        const make_new_withdrawal_btn = screen.getByText('Make a new withdrawal');
        fireEvent.click(make_new_withdrawal_btn);
        expect(mockRootStore.modules.cashier.withdraw.setIsWithdrawConfirmed).toHaveBeenCalledTimes(1);
    });
});
