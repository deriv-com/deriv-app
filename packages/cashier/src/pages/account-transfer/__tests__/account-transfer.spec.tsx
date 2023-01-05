import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router';
import { StoreProvider } from '@deriv/stores';
import { createBrowserHistory } from 'history';
import AccountTransfer from '../account-transfer';

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
    let mockRootStore;
    beforeEach(() => {
        mockRootStore = {
            client: {
                is_switching: false,
                is_virtual: false,
            },
            ui: {
                is_dark_mode_on: false,
            },
            modules: {
                cashier: {
                    deposit: { is_deposit_locked: true },
                    general_store: {
                        setActiveTab: jest.fn(),
                        is_cashier_locked: false,
                    },
                    account_transfer: {
                        error: {},
                        setAccountTransferAmount: jest.fn(),
                        setIsTransferConfirm: jest.fn(),
                        onMountAccountTransfer: jest.fn(),
                        accounts_list: [],
                        has_no_account: false,
                        has_no_accounts_balance: false,
                        is_transfer_confirm: false,
                        is_transfer_locked: false,
                    },
                    crypto_fiat_converter: {},
                    transaction_history: {
                        onMount: jest.fn(),
                        is_crypto_transactions_visible: false,
                    },
                },
            },
        };
    });

    const props = {
        setSideNotes: jest.fn(),
    };

    const renderAccountTransfer = () => {
        render(<AccountTransfer {...props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });
    };

    it('should render the account transfer form', async () => {
        renderAccountTransfer();

        expect(await screen.findByText('mockedAccountTransferForm')).toBeInTheDocument();
    });

    it('should not show the side notes when switching', async () => {
        mockRootStore.client.is_switching = true;

        renderAccountTransfer();

        await waitFor(() => {
            expect(props.setSideNotes).toHaveBeenCalledWith(null);
        });
    });

    it('should render the virtual component if client is using a demo account', async () => {
        const history = createBrowserHistory();
        mockRootStore.client.is_virtual = true;

        render(<AccountTransfer {...props} />, {
            wrapper: ({ children }) => (
                <StoreProvider store={mockRootStore}>
                    <Router history={history}>{children}</Router>
                </StoreProvider>
            ),
        });

        expect(
            await screen.findByText(/You need to switch to a real money account to use this feature./i)
        ).toBeInTheDocument();
    });

    it('should render the cashier locked component if cashier is locked', async () => {
        mockRootStore.modules.cashier.general_store.is_cashier_locked = true;

        renderAccountTransfer();

        expect(await screen.findByText('mockedCashierLocked')).toBeInTheDocument();
    });

    it('should render the transfer lock component if only transfer is locked', async () => {
        mockRootStore.modules.cashier.account_transfer.is_transfer_locked = true;

        renderAccountTransfer();

        expect(await screen.findByText('Transfers are locked')).toBeInTheDocument();
    });

    it('should render the error component if there are errors when transferring between accounts', async () => {
        mockRootStore.modules.cashier.account_transfer.error = {
            message: 'error',
        };

        renderAccountTransfer();

        expect(await screen.findByText('mockedError')).toBeInTheDocument();
    });

    it('should render the no account component if the client has only one account', async () => {
        mockRootStore.modules.cashier.account_transfer.has_no_account = true;

        renderAccountTransfer();

        expect(await screen.findByText('You need at least two accounts')).toBeInTheDocument();
    });

    it('should render the no balance component if the account has no balance', async () => {
        mockRootStore.modules.cashier.account_transfer.has_no_accounts_balance = true;
        const history = createBrowserHistory();

        render(<AccountTransfer {...props} />, {
            wrapper: ({ children }) => (
                <StoreProvider store={mockRootStore}>
                    <Router history={history}>{children}</Router>
                </StoreProvider>
            ),
        });

        expect(await screen.findByText(/You have no funds/i)).toBeInTheDocument();
    });

    it('should show the receipt if transfer is successful', async () => {
        mockRootStore.modules.cashier.account_transfer.is_transfer_confirm = true;

        renderAccountTransfer();

        expect(await screen.findByText('mockedAccountTransferReceipt')).toBeInTheDocument();
    });

    it('should show the crypto transactions if triggered from recent transactions', async () => {
        mockRootStore.modules.cashier.transaction_history.is_crypto_transactions_visible = true;

        renderAccountTransfer();

        expect(await screen.findByText('mockedCryptoTransactionsHistory')).toBeInTheDocument();
    });
});
