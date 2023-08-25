import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router';
import { useCashierLocked, useDepositLocked } from '@deriv/hooks';
import { createBrowserHistory } from 'history';
import AccountTransfer from '../account-transfer';
import CashierProviders from '../../../cashier-providers';
import { mockStore } from '@deriv/stores';

jest.mock('@deriv/shared/src/services/ws-methods', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    WS: {
        wait: (...payload: unknown[]) => {
            return Promise.resolve([...payload]);
        },
    },
    useWS: () => undefined,
}));

jest.mock('../account-transfer-form', () => jest.fn(() => 'mockedAccountTransferForm'));
jest.mock('Components/crypto-transactions-history', () => jest.fn(() => 'mockedCryptoTransactionsHistory'));
jest.mock('Components/cashier-locked', () => jest.fn(() => 'mockedCashierLocked'));
jest.mock('../account-transfer-no-account', () => jest.fn(() => 'mockedAccountTransferNoAccount'));
jest.mock('../account-transfer-receipt', () => jest.fn(() => 'mockedAccountTransferReceipt'));
jest.mock('Components/error', () => jest.fn(() => 'mockedError'));

jest.mock('@deriv/hooks');
const mockUseDepositLocked = useDepositLocked as jest.MockedFunction<typeof useDepositLocked>;
const mockUseCashierLocked = useCashierLocked as jest.MockedFunction<typeof useCashierLocked>;

const cashier_mock = {
    general_store: {
        setActiveTab: jest.fn(),
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
};

describe('<AccountTransfer />', () => {
    beforeEach(() => {
        mockUseDepositLocked.mockReturnValue(false);
        mockUseCashierLocked.mockReturnValue(false);
    });

    const props = {
        setSideNotes: jest.fn(),
        onClose: jest.fn(),
    };

    const renderAccountTransfer = (store: ReturnType<typeof mockStore>) => {
        render(<AccountTransfer {...props} />, {
            wrapper: ({ children }) => <CashierProviders store={store}>{children}</CashierProviders>,
        });
    };

    it('should render the account transfer form', async () => {
        const mock_root_store = mockStore({
            client: {
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
            modules: {
                cashier: cashier_mock,
            },
        });
        renderAccountTransfer(mock_root_store);

        expect(await screen.findByText('mockedAccountTransferForm')).toBeInTheDocument();
    });

    it('should not show the side notes when switching', async () => {
        const mock_root_store = mockStore({
            client: {
                is_switching: true,
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
            modules: {
                cashier: cashier_mock,
            },
        });

        renderAccountTransfer(mock_root_store);

        await waitFor(() => {
            expect(props.setSideNotes).toHaveBeenCalledWith(null);
        });
    });

    it('should render the virtual component if client is using a demo account', async () => {
        const history = createBrowserHistory();
        const mock_root_store = mockStore({
            client: {
                is_virtual: true,
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
            modules: {
                cashier: cashier_mock,
            },
        });

        render(<AccountTransfer {...props} />, {
            wrapper: ({ children }) => (
                <CashierProviders store={mock_root_store}>
                    <Router history={history}>{children}</Router>
                </CashierProviders>
            ),
        });

        expect(
            await screen.findByText(/You need to switch to a real money account to use this feature./i)
        ).toBeInTheDocument();
    });

    it('should render the cashier locked component if cashier is locked', async () => {
        mockUseCashierLocked.mockReturnValue(true);
        const mock_root_store = mockStore({
            client: {
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
            modules: {
                cashier: cashier_mock,
            },
        });

        renderAccountTransfer(mock_root_store);

        expect(await screen.findByText('mockedCashierLocked')).toBeInTheDocument();
    });

    it('should render the transfer lock component if only transfer is locked', async () => {
        const mock_root_store = mockStore({
            client: {
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    account_transfer: {
                        ...cashier_mock.account_transfer,
                        is_transfer_locked: true,
                    },
                },
            },
        });

        renderAccountTransfer(mock_root_store);

        expect(await screen.findByText('Transfers are locked')).toBeInTheDocument();
    });

    it('should render the error component if there are errors when transferring between accounts', async () => {
        const mock_root_store = mockStore({
            client: {
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    account_transfer: {
                        ...cashier_mock.account_transfer,
                        error: { message: 'error' },
                    },
                },
            },
        });

        renderAccountTransfer(mock_root_store);

        expect(await screen.findByText('mockedError')).toBeInTheDocument();
    });

    it('should render the no account component if the client has only one account', async () => {
        const mock_root_store = mockStore({
            client: {
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    account_transfer: {
                        ...cashier_mock.account_transfer,
                        has_no_account: true,
                    },
                },
            },
        });

        renderAccountTransfer(mock_root_store);

        expect(await screen.findByText('mockedAccountTransferNoAccount')).toBeInTheDocument();
    });

    it('should render the no balance component if the account has no balance', async () => {
        const mock_root_store = mockStore({
            client: {
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    account_transfer: {
                        ...cashier_mock.account_transfer,
                        has_no_accounts_balance: true,
                    },
                },
            },
        });

        const history = createBrowserHistory();

        render(<AccountTransfer {...props} />, {
            wrapper: ({ children }) => (
                <CashierProviders store={mock_root_store}>
                    <Router history={history}>{children}</Router>
                </CashierProviders>
            ),
        });

        expect(await screen.findByText(/You have no funds/i)).toBeInTheDocument();
    });

    it('should show the receipt if transfer is successful', async () => {
        const mock_root_store = mockStore({
            client: {
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    account_transfer: {
                        ...cashier_mock.account_transfer,
                        is_transfer_confirm: true,
                    },
                },
            },
        });

        renderAccountTransfer(mock_root_store);

        expect(await screen.findByText('mockedAccountTransferReceipt')).toBeInTheDocument();
    });
});
