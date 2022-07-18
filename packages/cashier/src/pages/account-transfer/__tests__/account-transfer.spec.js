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

jest.mock('../account-transfer-form', () => jest.fn(() => 'mockedAccountTransferForm'));
jest.mock('Components/crypto-transactions-history', () => jest.fn(() => 'mockedCryptoTransactionsHistory'));
jest.mock('Components/cashier-locked', () => jest.fn(() => 'mockedCashierLocked'));
jest.mock('../account-transfer-receipt', () => jest.fn(() => 'mockedAccountTransferReceipt'));
jest.mock('Components/error', () => jest.fn(() => 'mockedError'));

describe('<AccountTransfer />', () => {
    const props = {
        error: {},
        onMount: jest.fn(),
        recentTransactionOnMount: jest.fn(),
        setAccountTransferAmount: jest.fn(),
        setActiveTab: jest.fn(),
        setIsTransferConfirm: jest.fn(),
        setSideNotes: jest.fn(),
    };

    it('should render the account transfer form', async () => {
        render(<AccountTransfer {...props} />);

        expect(await screen.findByText('mockedAccountTransferForm')).toBeInTheDocument();
    });

    it('should not show the side notes when switching', async () => {
        render(<AccountTransfer is_switching {...props} />);

        await waitFor(() => {
            expect(props.setSideNotes).toHaveBeenCalledWith(null);
        });
    });

    it('should render the virtual component if client is using a demo account', async () => {
        const history = createBrowserHistory();

        render(
            <Router history={history}>
                <AccountTransfer is_virtual {...props} />
            </Router>
        );

        expect(
            await screen.findByText(/You need to switch to a real money account to use this feature./i)
        ).toBeInTheDocument();
    });

    it('should render the cashier locked component if cashier is locked', async () => {
        render(<AccountTransfer is_cashier_locked {...props} />);

        expect(await screen.findByText('mockedCashierLocked')).toBeInTheDocument();
    });

    it('should render the transfer lock component if only transfer is locked', async () => {
        render(<AccountTransfer is_transfer_locked {...props} />);

        expect(await screen.findByText('Transfers are locked')).toBeInTheDocument();
    });

    it('should render the error component if there are errors when transferring between accounts', async () => {
        const accounts_list = [];
        const cta_error = {
            message: 'error',
        };

        render(<AccountTransfer {...props} accounts_list={accounts_list} error={cta_error} />);

        expect(await screen.findByText('mockedError')).toBeInTheDocument();
    });

    it('should render the no account component if the client has only one account', async () => {
        render(<AccountTransfer has_no_account {...props} />);

        expect(await screen.findByText('You need at least two accounts')).toBeInTheDocument();
    });

    it('should render the no balance component if the account has no balance', async () => {
        const history = createBrowserHistory();

        render(
            <Router history={history}>
                <AccountTransfer has_no_accounts_balance {...props} />
            </Router>
        );

        expect(await screen.findByText(/You have no funds/i)).toBeInTheDocument();
    });

    it('should show the receipt if transfer is successful', async () => {
        render(<AccountTransfer is_transfer_confirm {...props} />);

        expect(await screen.findByText('mockedAccountTransferReceipt')).toBeInTheDocument();
    });

    it('should show the crypto transactions if triggered from recent transactions', async () => {
        render(<AccountTransfer is_crypto_transactions_visible {...props} />);

        expect(await screen.findByText('mockedCryptoTransactionsHistory')).toBeInTheDocument();
    });
});
