import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { isDesktop } from '@deriv/shared';
import { StoreProvider } from '@deriv/stores';
import Withdrawal from '../withdrawal';

jest.mock('Components/cashier-locked', () => jest.fn(() => 'CashierLocked'));
jest.mock('Components/cashier-container/virtual', () => jest.fn(() => 'Virtual'));
jest.mock('../withdrawal-locked', () => jest.fn(() => 'WithdrawalLocked'));
jest.mock('Components/no-balance', () => jest.fn(() => 'NoBalance'));
jest.mock('Components/error', () => jest.fn(() => 'Error'));
jest.mock('../withdraw', () => jest.fn(() => 'Withdraw'));
jest.mock('../crypto-withdraw-form', () => jest.fn(() => 'CryptoWithdrawForm'));
jest.mock('../crypto-withdraw-receipt', () => jest.fn(() => 'CryptoWithdrawReceipt'));
jest.mock('Components/crypto-transactions-history', () => jest.fn(() => 'CryptoTransactionsHistory'));
jest.mock('../withdrawal-verification-email', () => jest.fn(() => 'WithdrawalVerificationEmail'));
jest.mock('Components/recent-transaction', () => jest.fn(() => 'RecentTransaction'));
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));
jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isDesktop: jest.fn(() => true),
}));

describe('<Withdrawal />', () => {
    let history, mockRootStore, setSideNotes;
    beforeEach(() => {
        history = createBrowserHistory();
        mockRootStore = {
            client: {
                balance: '1000',
                currency: 'USD',
                current_currency_type: '',
                is_switching: false,
                is_virtual: false,
                verification_code: {
                    payment_withdraw: '',
                },
            },
            modules: {
                cashier: {
                    general_store: {
                        is_cashier_locked: false,
                        is_crypto: false,
                        is_system_maintenance: false,
                        setActiveTab: jest.fn(),
                    },
                    iframe: {
                        iframe_url: '',
                    },
                    transaction_history: {
                        is_crypto_transactions_visible: false,
                        onMount: jest.fn(),
                    },
                    withdraw: {
                        check10kLimit: jest.fn(),
                        is_10k_withdrawal_limit_reached: false,
                        is_withdraw_confirmed: false,
                        is_withdrawal_locked: false,
                        error: {
                            setErrorMessage: jest.fn(),
                        },
                        verification: {
                            error: {},
                        },
                        willMountWithdraw: jest.fn(),
                    },
                },
            },
        };
        setSideNotes = jest.fn();
    });

    const renderWithdrawal = (is_rerender = false) => {
        const ui = (
            <StoreProvider store={mockRootStore}>
                <Router history={history}>
                    <Withdrawal setSideNotes={setSideNotes} />
                </Router>
            </StoreProvider>
        );
        return is_rerender ? ui : render(ui);
    };

    it('should render <CashierLocked /> component', () => {
        mockRootStore.client.current_currency_type = 'crypto';
        mockRootStore.modules.cashier.general_store.is_system_maintenance = true;
        mockRootStore.modules.cashier.withdraw.is_withdrawal_locked = true;
        renderWithdrawal();

        expect(screen.getByText('CashierLocked')).toBeInTheDocument();
    });

    it('should render <Loading /> component', () => {
        mockRootStore.modules.cashier.withdraw.is_10k_withdrawal_limit_reached = undefined;
        renderWithdrawal();

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should render <Virtual /> component', () => {
        mockRootStore.client.is_virtual = true;
        renderWithdrawal();

        expect(screen.getByText('Virtual')).toBeInTheDocument();
    });

    it('should render <CashierLocked /> component when "is_cashier_locked = true"', () => {
        mockRootStore.modules.cashier.general_store.is_cashier_locked = true;
        renderWithdrawal();

        expect(screen.getByText('CashierLocked')).toBeInTheDocument();
    });

    it('should render <WithdrawalLocked /> component', () => {
        mockRootStore.modules.cashier.withdraw.is_withdrawal_locked = true;
        const { rerender } = renderWithdrawal() as ReturnType<typeof render>;

        expect(screen.getByText('WithdrawalLocked')).toBeInTheDocument();

        mockRootStore.modules.cashier.withdraw.is_10k_withdrawal_limit_reached = true;
        rerender(renderWithdrawal(true) as JSX.Element);

        expect(screen.getByText('WithdrawalLocked')).toBeInTheDocument();
    });

    it('should render <NoBalance /> component', () => {
        mockRootStore.client.balance = '0';
        renderWithdrawal();

        expect(screen.getByText('NoBalance')).toBeInTheDocument();
    });

    it('should render <Error /> component', () => {
        mockRootStore.modules.cashier.withdraw.error = {
            is_show_full_page: true,
            message: 'Error message',
            setErrorMessage: jest.fn(),
        };
        const { rerender } = renderWithdrawal() as ReturnType<typeof render>;

        expect(screen.getByText('Error')).toBeInTheDocument();

        mockRootStore.modules.cashier.withdraw.verification.error = { message: 'Error message' };
        rerender(renderWithdrawal(true) as JSX.Element);

        expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('should render <Withdraw /> component', () => {
        mockRootStore.client.verification_code.payment_withdraw = 'verification_code';

        const { rerender } = renderWithdrawal() as ReturnType<typeof render>;
        expect(screen.getByText('Withdraw')).toBeInTheDocument();

        mockRootStore.modules.cashier.iframe.iframe_url = 'coiframe_urlde';
        rerender(renderWithdrawal(true) as JSX.Element);

        expect(screen.getByText('Withdraw')).toBeInTheDocument();
    });

    it('should render <CryptoWithdrawForm /> component', () => {
        mockRootStore.client.verification_code.payment_withdraw = 'verification_code';
        mockRootStore.modules.cashier.general_store.is_crypto = true;
        renderWithdrawal();

        expect(screen.getByText('CryptoWithdrawForm')).toBeInTheDocument();
    });

    it('should render <CryptoWithdrawReceipt /> component', () => {
        mockRootStore.modules.cashier.withdraw.is_withdraw_confirmed = true;
        renderWithdrawal();

        expect(screen.getByText('CryptoWithdrawReceipt')).toBeInTheDocument();
    });

    it('should render <CryptoTransactionsHistory /> component', () => {
        mockRootStore.modules.cashier.transaction_history.is_crypto_transactions_visible = true;
        renderWithdrawal();

        expect(screen.getByText('CryptoTransactionsHistory')).toBeInTheDocument();
    });

    it('should render <WithdrawalVerificationEmail /> component', () => {
        renderWithdrawal();

        expect(screen.getByText('WithdrawalVerificationEmail')).toBeInTheDocument();
    });

    it('should not trigger "setSideNotes" callback if "isDesktop = false"', () => {
        isDesktop.mockReturnValueOnce(false);

        renderWithdrawal();

        expect(setSideNotes).not.toHaveBeenCalled();
    });

    it('should trigger "setSideNotes" callback in Desktop mode', () => {
        mockRootStore.client.currency = 'BTC';
        mockRootStore.modules.cashier.transaction_history.crypto_transactions = [{}];
        renderWithdrawal();

        expect(setSideNotes).toHaveBeenCalledTimes(1);
    });
});
