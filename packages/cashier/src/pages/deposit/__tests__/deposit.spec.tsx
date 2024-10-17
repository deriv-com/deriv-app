import React from 'react';
import { render, screen } from '@testing-library/react';
import { useDepositLocked, useCurrentCurrencyConfig } from '@deriv/hooks';
import { mockStore } from '@deriv/stores';
import CashierProviders from '../../../cashier-providers';
import Deposit from '../deposit';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useDepositLocked: jest.fn(() => false),
    useCashierLocked: jest.fn(() => false),
    useIsSystemMaintenance: jest.fn(() => false),
    useCurrentCurrencyConfig: jest.fn(() => ({
        platform: { cashier: ['doughflow'], ramp: [] },
    })),
}));

jest.mock('../../../modules', () => ({
    ...jest.requireActual('@deriv/hooks'),
    DepositFiatModule: () => <div>DepositFiatModule</div>,
    DepositCryptoModule: () => <div>DepositCryptoModule</div>,
}));

jest.mock('Components/transactions-crypto-history', () => {
    const TransactionsCryptoHistory = () => <div>TransactionsCryptoHistory</div>;
    return TransactionsCryptoHistory;
});

jest.mock('../deposit-locked', () => {
    const DepositLocked = () => <div>DepositLocked</div>;
    return DepositLocked;
});

describe('<Deposit />', () => {
    let mockRootStore: ReturnType<typeof mockStore>;
    beforeEach(() => {
        (useDepositLocked as jest.Mock).mockReturnValue(false);
        mockRootStore = mockStore({
            client: {
                is_authorize: true,
            },
            modules: {
                cashier: {
                    iframe: {},
                    transaction_history: {
                        is_transactions_crypto_visible: false,
                    },
                    general_store: {
                        is_crypto: false,
                        is_deposit: false,
                    },
                },
            },
            traders_hub: { is_low_risk_cr_eu_real: false },
        });
    });

    const renderDeposit = () => {
        render(<Deposit />, {
            wrapper: ({ children }) => (
                <Router history={createBrowserHistory()}>
                    <CashierProviders store={mockRootStore}>{children}</CashierProviders>
                </Router>
            ),
        });
    };

    it('should render <DepositLocked /> component', () => {
        (useDepositLocked as jest.Mock).mockReturnValue(true);

        renderDeposit();

        expect(screen.getByText('DepositLocked')).toBeInTheDocument();
    });

    it('should render <TransactionsCryptoHistory /> component', () => {
        mockRootStore.modules.cashier.transaction_history.is_transactions_crypto_visible = true;

        renderDeposit();

        expect(screen.getByText('TransactionsCryptoHistory')).toBeInTheDocument();
    });

    it('renders `DepositFiatModule` if cashier platform provider equals to `doughflow`', () => {
        const mock_root_store = mockStore({
            modules: {
                cashier: {
                    transaction_history: {
                        is_transactions_crypto_visible: false,
                    },
                    general_store: {
                        is_deposit: true,
                    },
                },
            },
        });

        render(<Deposit />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });
    });

    it('renders `DepositCryptoModule` if cashier platform provider equals to `crypto`', () => {
        const mock_root_store = mockStore({
            modules: {
                cashier: {
                    transaction_history: {
                        is_transactions_crypto_visible: false,
                    },
                    general_store: {
                        is_deposit: true,
                        setIsDeposit: jest.fn(),
                    },
                },
            },
        });

        (useCurrentCurrencyConfig as jest.Mock).mockReturnValue({
            platform: { cashier: ['crypto'], ramp: ['banxa'] },
        });

        render(<Deposit />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });
    });
});
