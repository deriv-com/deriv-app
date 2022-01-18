import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import AccountTransfer from '../account-transfer';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/shared/src/services/ws-methods', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    WS: {
        wait: (...payload) => {
            return Promise.resolve([...payload]);
        },
    },
}));

jest.mock('Components/Form/account-transfer-form', () => jest.fn(() => 'mockedAccountTransferForm'));
jest.mock('Components/Form/crypto-transactions-history', () => jest.fn(() => 'mockedCryptoTransactionsHistory'));
jest.mock('Components/Error/cashier-locked', () => jest.fn(() => 'mockedCashierLocked'));
jest.mock('Components/Receipt/account-transfer-receipt', () => jest.fn(() => 'mockedAccountTransferReceipt'));
jest.mock('Components/Error/error', () => jest.fn(() => 'mockedError'));

describe('<AccountTransfer />', () => {
    const history = createBrowserHistory();
    const error = {};
    const onMount = jest.fn();
    const recentTransactionOnMount = jest.fn();
    const setAccountTransferAmount = jest.fn();
    const setActiveTab = jest.fn();
    const setIsTransferConfirm = jest.fn();
    const setSideNotes = jest.fn();

    it('should render the account transfer form', async () => {
        render(
            <AccountTransfer
                error={error}
                onMount={onMount}
                recentTransactionOnMount={recentTransactionOnMount}
                setAccountTransferAmount={setAccountTransferAmount}
                setActiveTab={setActiveTab}
                setIsTransferConfirm={setIsTransferConfirm}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('mockedAccountTransferForm')).toBeInTheDocument();
        });
    });

    it('should not show the side notes when switching', async () => {
        render(
            <Router history={history}>
                <AccountTransfer
                    is_switching
                    error={error}
                    onMount={onMount}
                    recentTransactionOnMount={recentTransactionOnMount}
                    setAccountTransferAmount={setAccountTransferAmount}
                    setActiveTab={setActiveTab}
                    setIsTransferConfirm={setIsTransferConfirm}
                    setSideNotes={setSideNotes}
                />
            </Router>
        );

        await waitFor(() => {
            expect(setSideNotes).toHaveBeenCalled();
        });
    });

    it('should render the virtual component if client is using a demo account', async () => {
        render(
            <Router history={history}>
                <AccountTransfer
                    is_virtual
                    error={error}
                    onMount={onMount}
                    recentTransactionOnMount={recentTransactionOnMount}
                    setAccountTransferAmount={setAccountTransferAmount}
                    setActiveTab={setActiveTab}
                    setIsTransferConfirm={setIsTransferConfirm}
                />
            </Router>
        );

        await waitFor(() => {
            expect(
                screen.getByText(/You need to switch to a real money account to use this feature./i)
            ).toBeInTheDocument();
        });
    });

    it('should render the cashier locked component if cashier is locked', async () => {
        render(
            <AccountTransfer
                is_cashier_locked
                error={error}
                onMount={onMount}
                recentTransactionOnMount={recentTransactionOnMount}
                setAccountTransferAmount={setAccountTransferAmount}
                setActiveTab={setActiveTab}
                setIsTransferConfirm={setIsTransferConfirm}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('mockedCashierLocked')).toBeInTheDocument();
        });
    });

    it('should render the transfer lock component if only transfer is locked', async () => {
        render(
            <AccountTransfer
                is_transfer_lock
                error={error}
                onMount={onMount}
                recentTransactionOnMount={recentTransactionOnMount}
                setAccountTransferAmount={setAccountTransferAmount}
                setActiveTab={setActiveTab}
                setIsTransferConfirm={setIsTransferConfirm}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Transfers are locked')).toBeInTheDocument();
        });
    });

    it('should render the error component if there are errors when transferring between accounts', async () => {
        const accounts_list = [];
        const cta_error = {
            message: 'error',
        };

        render(
            <AccountTransfer
                accounts_list={accounts_list}
                error={cta_error}
                onMount={onMount}
                recentTransactionOnMount={recentTransactionOnMount}
                setAccountTransferAmount={setAccountTransferAmount}
                setActiveTab={setActiveTab}
                setIsTransferConfirm={setIsTransferConfirm}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('mockedError')).toBeInTheDocument();
        });
    });

    it('should render the no account component if the client has only one account', async () => {
        render(
            <AccountTransfer
                has_no_account
                error={error}
                onMount={onMount}
                recentTransactionOnMount={recentTransactionOnMount}
                setAccountTransferAmount={setAccountTransferAmount}
                setActiveTab={setActiveTab}
                setIsTransferConfirm={setIsTransferConfirm}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('You need at least two accounts')).toBeInTheDocument();
        });
    });

    it('should render the no balance component if the account has no balance', async () => {
        render(
            <Router history={history}>
                <AccountTransfer
                    has_no_accounts_balance
                    error={error}
                    onMount={onMount}
                    recentTransactionOnMount={recentTransactionOnMount}
                    setAccountTransferAmount={setAccountTransferAmount}
                    setActiveTab={setActiveTab}
                    setIsTransferConfirm={setIsTransferConfirm}
                    setSideNotes={setSideNotes}
                />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText(/You have no funds/i)).toBeInTheDocument();
            expect(setSideNotes).toHaveBeenCalled();
        });
    });

    it('should show the receipt if transfer is successful', async () => {
        render(
            <Router history={history}>
                <AccountTransfer
                    is_transfer_confirm
                    error={error}
                    onMount={onMount}
                    recentTransactionOnMount={recentTransactionOnMount}
                    setAccountTransferAmount={setAccountTransferAmount}
                    setActiveTab={setActiveTab}
                    setIsTransferConfirm={setIsTransferConfirm}
                />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('mockedAccountTransferReceipt')).toBeInTheDocument();
        });
    });

    it('should show the crypto transactions if triggered from recent transactions', async () => {
        render(
            <Router history={history}>
                <AccountTransfer
                    is_crypto_transactions_visible
                    error={error}
                    onMount={onMount}
                    recentTransactionOnMount={recentTransactionOnMount}
                    setAccountTransferAmount={setAccountTransferAmount}
                    setActiveTab={setActiveTab}
                    setIsTransferConfirm={setIsTransferConfirm}
                />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('mockedCryptoTransactionsHistory')).toBeInTheDocument();
        });
    });
});
