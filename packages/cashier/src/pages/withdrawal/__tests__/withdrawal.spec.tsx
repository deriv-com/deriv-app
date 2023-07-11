import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { isDesktop } from '@deriv/shared';
import Withdrawal from '../withdrawal';
import CashierProviders from '../../../cashier-providers';
import { mockStore } from '@deriv/stores';
import { useCashierLocked } from '@deriv/hooks';

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
jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useCashierLocked: jest.fn(() => false),
}));
const mockUseCashierLocked = useCashierLocked as jest.MockedFunction<typeof useCashierLocked>;

const cashier_mock = {
    general_store: {
        is_crypto: false,
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
};

describe('<Withdrawal />', () => {
    let setSideNotes: VoidFunction;

    beforeEach(() => {
        setSideNotes = jest.fn();
        mockUseCashierLocked.mockReturnValue(false);
    });

    const mockWithdrawal = (mock_root_store: ReturnType<typeof mockStore>, is_rerender = false) => {
        return (
            <CashierProviders store={mock_root_store}>
                <Router history={createBrowserHistory()}>
                    <Withdrawal setSideNotes={setSideNotes} />
                </Router>
            </CashierProviders>
        );
    };

    it('should render <CashierLocked /> component', () => {
        const mock_root_store = mockStore({
            client: {
                account_status: { cashier_validation: ['system_maintenance'] },
                balance: '1000',
                currency: 'USD',
                current_currency_type: 'crypto',
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    withdraw: {
                        ...cashier_mock.withdraw,
                        is_withdrawal_locked: true,
                    },
                },
            },
        });
        render(mockWithdrawal(mock_root_store));

        expect(screen.getByText('CashierLocked')).toBeInTheDocument();
    });

    it('should render <Loading /> component', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '1000',
                currency: 'USD',
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    withdraw: {
                        ...cashier_mock.withdraw,
                        is_10k_withdrawal_limit_reached: undefined,
                    },
                },
            },
        });
        render(mockWithdrawal(mock_root_store));

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should render <Virtual /> component', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '1000',
                currency: 'USD',
                is_virtual: true,
            },
            modules: { cashier: cashier_mock },
        });
        render(mockWithdrawal(mock_root_store));

        expect(screen.getByText('Virtual')).toBeInTheDocument();
    });

    it('should render <CashierLocked /> component when useCashierLocked returns true', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '1000',
                currency: 'USD',
            },
            modules: { cashier: cashier_mock },
        });
        mockUseCashierLocked.mockReturnValue(true);
        render(mockWithdrawal(mock_root_store));

        expect(screen.getByText('CashierLocked')).toBeInTheDocument();
    });

    it('should render <WithdrawalLocked /> component', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '1000',
                currency: 'USD',
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    withdraw: {
                        ...cashier_mock.withdraw,
                        is_withdrawal_locked: true,
                    },
                },
            },
        });
        const { rerender } = render(mockWithdrawal(mock_root_store));

        expect(screen.getByText('WithdrawalLocked')).toBeInTheDocument();

        mock_root_store.modules.cashier.withdraw.is_10k_withdrawal_limit_reached = true;
        rerender(mockWithdrawal(mock_root_store));

        expect(screen.getByText('WithdrawalLocked')).toBeInTheDocument();
    });

    it('should render <NoBalance /> component', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '0',
                currency: 'USD',
            },
            modules: { cashier: cashier_mock },
        });
        render(mockWithdrawal(mock_root_store));

        expect(screen.getByText('NoBalance')).toBeInTheDocument();
    });

    it('should render <Error /> component', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '1000',
                currency: 'USD',
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    withdraw: {
                        ...cashier_mock.withdraw,
                        error: {
                            is_show_full_page: true,
                            message: 'Error message',
                            setErrorMessage: jest.fn(),
                        },
                    },
                },
            },
        });
        const { rerender } = render(mockWithdrawal(mock_root_store));

        expect(screen.getByText('Error')).toBeInTheDocument();

        mock_root_store.modules.cashier.withdraw.verification.error = { message: 'Error message' };
        rerender(mockWithdrawal(mock_root_store));

        expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('should render <Withdraw /> component', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '1000',
                currency: 'USD',
                verification_code: { payment_withdraw: 'verification_code' },
            },
            modules: { cashier: cashier_mock },
        });

        const { rerender } = render(mockWithdrawal(mock_root_store));
        expect(screen.getByText('Withdraw')).toBeInTheDocument();

        mock_root_store.modules.cashier.iframe.iframe_url = 'coiframe_urlde';
        rerender(mockWithdrawal(mock_root_store));

        expect(screen.getByText('Withdraw')).toBeInTheDocument();
    });

    it('should render <CryptoWithdrawForm /> component', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '1000',
                currency: 'USD',
                verification_code: { payment_withdraw: 'verification_code' },
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    general_store: {
                        is_crypto: true,
                        setActiveTab: jest.fn(),
                    },
                },
            },
        });
        render(mockWithdrawal(mock_root_store));

        expect(screen.getByText('CryptoWithdrawForm')).toBeInTheDocument();
    });

    it('should render <CryptoWithdrawReceipt /> component', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '1000',
                currency: 'USD',
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    withdraw: {
                        ...cashier_mock.withdraw,
                        is_withdraw_confirmed: true,
                    },
                },
            },
        });
        render(mockWithdrawal(mock_root_store));

        expect(screen.getByText('CryptoWithdrawReceipt')).toBeInTheDocument();
    });

    it('should render <CryptoTransactionsHistory /> component', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '1000',
                currency: 'USD',
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    transaction_history: {
                        is_crypto_transactions_visible: true,
                        onMount: jest.fn(),
                    },
                },
            },
        });
        render(mockWithdrawal(mock_root_store));

        expect(screen.getByText('CryptoTransactionsHistory')).toBeInTheDocument();
    });

    it('should render <WithdrawalVerificationEmail /> component', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '1000',
                currency: 'USD',
            },
            modules: { cashier: cashier_mock },
        });
        render(mockWithdrawal(mock_root_store));

        expect(screen.getByText('WithdrawalVerificationEmail')).toBeInTheDocument();
    });

    it('should not trigger "setSideNotes" callback if "isDesktop = false"', () => {
        const mock_root_store = mockStore({
            client: {
                account_status: { cashier_validation: ['system_maintenance'] },
                balance: '1000',
                currency: 'USD',
                current_currency_type: 'crypto',
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    withdraw: {
                        ...cashier_mock.withdraw,
                        is_withdrawal_locked: true,
                    },
                },
            },
        });
        (isDesktop as jest.Mock).mockReturnValueOnce(false);

        render(mockWithdrawal(mock_root_store));

        expect(setSideNotes).not.toHaveBeenCalled();
    });

    it('should trigger "setSideNotes" callback in Desktop mode', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '1000',
                currency: 'BTC',
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    transaction_history: {
                        ...cashier_mock.transaction_history,
                        crypto_transactions: [{}],
                    },
                },
            },
        });
        render(mockWithdrawal(mock_root_store));

        expect(setSideNotes).toHaveBeenCalledTimes(1);
    });
});
