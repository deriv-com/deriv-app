import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router';
import { useCashierLocked, useTradingPlatformStatus } from '@deriv/hooks';
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
}));

jest.mock('Components/transactions-crypto-history', () => jest.fn(() => 'mockedTransactionsCryptoHistory'));
jest.mock('Components/cashier-locked', () => jest.fn(() => 'mockedCashierLocked'));
jest.mock('Components/error', () => jest.fn(() => 'mockedError'));
jest.mock('../account-transfer-no-account', () => jest.fn(() => 'mockedAccountTransferNoAccount'));
jest.mock('../account-transfer-form', () => jest.fn(() => 'mockedAccountTransferForm'));
jest.mock('../account-transfer-form/account-transfer-form-side-note', () =>
    jest.fn(() => 'mockedAccountTransferFormSideNote')
);

jest.mock('@deriv/hooks');
const mockUseCashierLocked = useCashierLocked as jest.MockedFunction<typeof useCashierLocked>;
const mockUseTradingPlatformStatus = useTradingPlatformStatus as jest.MockedFunction<typeof useTradingPlatformStatus>;

describe('<AccountTransfer />', () => {
    let mockRootStore: ReturnType<typeof mockStore>;

    beforeEach(() => {
        mockUseCashierLocked.mockReturnValue(false);
        mockRootStore = mockStore({
            client: {
                is_authorize: true,
                is_switching: false,
                is_virtual: false,
            },
            modules: {
                cashier: {
                    general_store: {
                        is_loading: false,
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
                },
            },
        });
        mockUseTradingPlatformStatus.mockReturnValue({
            data: [
                {
                    platform: 'mt5',
                    status: 'active',
                },
            ],
            getPlatformStatus: jest.fn(),
        });
    });

    const props = {
        setSideNotes: jest.fn(),
        onClose: jest.fn(),
    };

    const renderAccountTransfer = () => {
        render(<AccountTransfer {...props} />, {
            wrapper: ({ children }) => (
                <Router history={createBrowserHistory()}>
                    <CashierProviders store={mockRootStore}>{children}</CashierProviders>
                </Router>
            ),
        });
    };

    it('renders the account transfer form', async () => {
        renderAccountTransfer();

        await expect(screen.findByText('mockedAccountTransferForm')).resolves.toBeInTheDocument();
    });

    it('renders the virtual component if client is using a demo account', async () => {
        mockRootStore.client.is_virtual = true;
        renderAccountTransfer();

        expect(
            await screen.findByText(/You need to switch to a real money account to use this feature./i)
        ).toBeInTheDocument();
    });

    it('renders the cashier locked component if cashier is locked', async () => {
        mockUseCashierLocked.mockReturnValue(true);
        renderAccountTransfer();

        expect(await screen.findByText('mockedCashierLocked')).toBeInTheDocument();
    });

    it('renders the transfer lock component if only transfer is locked', async () => {
        mockRootStore.modules.cashier.account_transfer.is_transfer_locked = true;
        renderAccountTransfer();

        expect(await screen.findByText('Transfers are locked')).toBeInTheDocument();
    });

    it('renders the error component if there are errors when transferring between accounts', async () => {
        mockRootStore.modules.cashier.account_transfer.error.message = 'error';
        renderAccountTransfer();

        expect(await screen.findByText('mockedError')).toBeInTheDocument();
    });

    it('renders the no account component if the client has only one account', async () => {
        mockRootStore.modules.cashier.account_transfer.has_no_account = true;
        renderAccountTransfer();

        expect(await screen.findByText('mockedAccountTransferNoAccount')).toBeInTheDocument();
    });

    it('renders the no balance component if the account has no balance', async () => {
        mockRootStore.modules.cashier.account_transfer.has_no_accounts_balance = true;
        renderAccountTransfer();

        expect(await screen.findByText(/You have no funds/i)).toBeInTheDocument();
    });
});
