import React from 'react';
import { render, screen } from '@testing-library/react';
import Withdrawal from '../withdrawal';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { isDesktop } from '@deriv/shared';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

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
    const props = {
        check10kLimit: jest.fn(),
        recentTransactionOnMount: jest.fn(),
        setActiveTab: jest.fn(),
        setErrorMessage: jest.fn(),
        setSideNotes: jest.fn(),
        willMountWithdraw: jest.fn(),
        balance: '1000',
        currency: 'USD',
        current_currency_type: '',
        error: {},
        is_10k_withdrawal_limit_reached: false,
        is_cashier_locked: false,
        is_crypto: false,
        is_crypto_transactions_visible: false,
        is_system_maintenance: false,
        is_switching: false,
        is_withdraw_confirmed: false,
        is_withdrawal_locked: false,
        is_virtual: false,
        verification_code: '',
        verify_error: {},
    };

    it('should render <CashierLocked /> component', () => {
        const history = createBrowserHistory();

        render(
            <Router history={history}>
                <Withdrawal {...props} current_currency_type='crypto' is_system_maintenance is_withdrawal_locked />
            </Router>
        );

        expect(screen.getByText('CashierLocked')).toBeInTheDocument();
    });

    it('should render <Loading /> component', () => {
        const history = createBrowserHistory();

        render(
            <Router history={history}>
                <Withdrawal {...props} is_10k_withdrawal_limit_reached={undefined} />
            </Router>
        );

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should render <Virtual /> component', () => {
        const history = createBrowserHistory();

        render(
            <Router history={history}>
                <Withdrawal {...props} is_virtual />
            </Router>
        );

        expect(screen.getByText('Virtual')).toBeInTheDocument();
    });

    it('should render <CashierLocked /> component when "is_cashier_locked = true"', () => {
        const history = createBrowserHistory();

        render(
            <Router history={history}>
                <Withdrawal {...props} is_cashier_locked />
            </Router>
        );

        expect(screen.getByText('CashierLocked')).toBeInTheDocument();
    });

    it('should render <WithdrawalLocked /> component', () => {
        const history = createBrowserHistory();

        const { rerender } = render(
            <Router history={history}>
                <Withdrawal {...props} is_withdrawal_locked />
            </Router>
        );

        expect(screen.getByText('WithdrawalLocked')).toBeInTheDocument();

        rerender(
            <Router history={history}>
                <Withdrawal {...props} is_10k_withdrawal_limit_reached />
            </Router>
        );

        expect(screen.getByText('WithdrawalLocked')).toBeInTheDocument();
    });

    it('should render <NoBalance /> component', () => {
        const history = createBrowserHistory();

        render(
            <Router history={history}>
                <Withdrawal {...props} balance='0' />
            </Router>
        );

        expect(screen.getByText('NoBalance')).toBeInTheDocument();
    });

    it('should render <Error /> component', () => {
        const history = createBrowserHistory();

        const { rerender } = render(
            <Router history={history}>
                <Withdrawal {...props} error={{ is_show_full_page: true, message: 'Error message' }} />
            </Router>
        );

        expect(screen.getByText('Error')).toBeInTheDocument();

        rerender(
            <Router history={history}>
                <Withdrawal {...props} verify_error={{ message: 'Error message' }} />
            </Router>
        );

        expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('should render <Withdraw /> component', () => {
        const history = createBrowserHistory();

        const { rerender } = render(
            <Router history={history}>
                <Withdrawal {...props} verification_code='verification_code' />
            </Router>
        );

        expect(screen.getByText('Withdraw')).toBeInTheDocument();

        rerender(
            <Router history={history}>
                <Withdrawal {...props} iframe_url='coiframe_urlde' />
            </Router>
        );

        expect(screen.getByText('Withdraw')).toBeInTheDocument();
    });

    it('should render <CryptoWithdrawForm /> component', () => {
        const history = createBrowserHistory();

        render(
            <Router history={history}>
                <Withdrawal {...props} is_crypto verification_code='verification_code' />
            </Router>
        );

        expect(screen.getByText('CryptoWithdrawForm')).toBeInTheDocument();
    });

    it('should render <CryptoWithdrawReceipt /> component', () => {
        const history = createBrowserHistory();

        render(
            <Router history={history}>
                <Withdrawal {...props} is_withdraw_confirmed />
            </Router>
        );

        expect(screen.getByText('CryptoWithdrawReceipt')).toBeInTheDocument();
    });

    it('should render <CryptoTransactionsHistory /> component', () => {
        const history = createBrowserHistory();

        render(
            <Router history={history}>
                <Withdrawal {...props} is_crypto_transactions_visible />
            </Router>
        );

        expect(screen.getByText('CryptoTransactionsHistory')).toBeInTheDocument();
    });

    it('should render <WithdrawalVerificationEmail /> component', () => {
        const history = createBrowserHistory();

        render(
            <Router history={history}>
                <Withdrawal {...props} />
            </Router>
        );

        expect(screen.getByText('WithdrawalVerificationEmail')).toBeInTheDocument();
    });

    it('should not trigger "setSideNotes" callback if "isDesktop = false"', () => {
        const history = createBrowserHistory();
        isDesktop.mockReturnValueOnce(false);

        render(
            <Router history={history}>
                <Withdrawal {...props} />
            </Router>
        );

        expect(props.setSideNotes).not.toHaveBeenCalled();
    });

    it('should trigger "setSideNotes" callback in Desktop mode', () => {
        const history = createBrowserHistory();

        render(
            <Router history={history}>
                <Withdrawal {...props} crypto_transactions={[{}]} currency='BTC' />
            </Router>
        );

        expect(props.setSideNotes).toHaveBeenCalledTimes(1);
    });
});
