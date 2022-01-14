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

jest.mock('Components/Error/cashier-locked', () => () => <div>CashierLocked</div>);
jest.mock('Components/Error/virtual', () => () => <div>Virtual</div>);
jest.mock('Components/Error/withdrawal-locked', () => () => <div>WithdrawalLocked</div>);
jest.mock('Components/Error/no-balance', () => () => <div>NoBalance</div>);
jest.mock('Components/Error/error', () => () => <div>Error</div>);
jest.mock('Components/withdraw', () => () => <div>Withdraw</div>);
jest.mock('Components/Form/crypto-withdraw-form', () => () => <div>CryptoWithdrawForm</div>);
jest.mock('Components/Receipt/crypto-withdraw-receipt', () => () => <div>CryptoWithdrawReceipt</div>);
jest.mock('Components/Form/crypto-transactions-history', () => () => <div>CryptoTransactionsHistory</div>);
jest.mock('Components/Email/send-email', () => () => <div>SendEmail</div>);
jest.mock('Components/recent-transaction', () => () => <div>RecentTransaction</div>);
jest.mock('@deriv/components', () => ({
    __esModule: true,
    Loading: () => <div>Loading</div>,
}));
jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isDesktop: jest.fn(),
}));

describe('<Withdrawal />', () => {
    const mockDefaultProps = () => ({
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
    });

    it('should render <CashierLocked /> component', () => {
        isDesktop.mockReturnValue(true);
        const props = mockDefaultProps();
        const history = createBrowserHistory();
        props.current_currency_type = 'crypto';
        props.is_system_maintenance = true;
        props.is_withdrawal_locked = true;
        render(
            <Router history={history}>
                <Withdrawal {...props} />
            </Router>
        );

        expect(screen.getByText('CashierLocked')).toBeInTheDocument();
    });

    it('should render <Loading /> component', () => {
        isDesktop.mockReturnValue(true);
        const props = mockDefaultProps();
        const history = createBrowserHistory();
        props.is_10k_withdrawal_limit_reached = undefined;
        render(
            <Router history={history}>
                <Withdrawal {...props} />
            </Router>
        );

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should render <Virtual /> component', () => {
        isDesktop.mockReturnValue(true);
        const props = mockDefaultProps();
        const history = createBrowserHistory();
        props.is_virtual = true;
        render(
            <Router history={history}>
                <Withdrawal {...props} />
            </Router>
        );

        expect(screen.getByText('Virtual')).toBeInTheDocument();
    });

    it('should render <CashierLocked /> component when "is_cashier_locked = true"', () => {
        isDesktop.mockReturnValue(true);
        const props = mockDefaultProps();
        const history = createBrowserHistory();
        props.is_cashier_locked = true;
        render(
            <Router history={history}>
                <Withdrawal {...props} />
            </Router>
        );

        expect(screen.getByText('CashierLocked')).toBeInTheDocument();
    });

    it('should render <WithdrawalLocked /> component', () => {
        const renderWithCustomProperty = property => {
            isDesktop.mockReturnValue(true);
            const history = createBrowserHistory();
            const props = mockDefaultProps();
            props[property] = true;
            const { unmount } = render(
                <Router history={history}>
                    <Withdrawal {...props} />
                </Router>
            );

            expect(screen.getByText('WithdrawalLocked')).toBeInTheDocument();
            unmount();
        };

        renderWithCustomProperty('is_withdrawal_locked');
        renderWithCustomProperty('is_10k_withdrawal_limit_reached');
    });

    it('should render <NoBalance /> component', () => {
        isDesktop.mockReturnValue(true);
        const props = mockDefaultProps();
        const history = createBrowserHistory();
        props.balance = '0';
        render(
            <Router history={history}>
                <Withdrawal {...props} />
            </Router>
        );

        expect(screen.getByText('NoBalance')).toBeInTheDocument();
    });

    it('should render <Error /> component', () => {
        const renderWithCustomProperty = property => {
            isDesktop.mockReturnValue(true);
            const history = createBrowserHistory();
            const props = mockDefaultProps();
            props[property] = { message: 'Error message' };
            const { unmount } = render(
                <Router history={history}>
                    <Withdrawal {...props} />
                </Router>
            );

            expect(screen.getByText('Error')).toBeInTheDocument();
            unmount();
        };

        renderWithCustomProperty('error');
        renderWithCustomProperty('verify_error');
    });

    it('should render <Withdraw /> component', () => {
        const renderWithCustomProperty = property => {
            isDesktop.mockReturnValue(true);
            const history = createBrowserHistory();
            const props = mockDefaultProps();
            props.is_crypto = false;
            props[property] = property === 'verification_code' ? 'CODE' : 'iframe_url';
            const { unmount } = render(
                <Router history={history}>
                    <Withdrawal {...props} />
                </Router>
            );

            expect(screen.getByText('Withdraw')).toBeInTheDocument();
            unmount();
        };

        renderWithCustomProperty('verification_code');
        renderWithCustomProperty('iframe_url');
    });

    it('should render <CryptoWithdrawForm /> component', () => {
        isDesktop.mockReturnValue(true);
        const history = createBrowserHistory();
        const props = mockDefaultProps();
        props.verification_code = 'CODE';
        props.is_crypto = true;

        render(
            <Router history={history}>
                <Withdrawal {...props} />
            </Router>
        );

        expect(screen.getByText('CryptoWithdrawForm')).toBeInTheDocument();
    });

    it('should render <CryptoWithdrawReceipt /> component', () => {
        isDesktop.mockReturnValue(true);
        const history = createBrowserHistory();
        const props = mockDefaultProps();
        props.is_withdraw_confirmed = true;

        render(
            <Router history={history}>
                <Withdrawal {...props} />
            </Router>
        );

        expect(screen.getByText('CryptoWithdrawReceipt')).toBeInTheDocument();
    });

    it('should render <CryptoTransactionsHistory /> component', () => {
        isDesktop.mockReturnValue(true);
        const history = createBrowserHistory();
        const props = mockDefaultProps();
        props.is_crypto_transactions_visible = true;

        render(
            <Router history={history}>
                <Withdrawal {...props} />
            </Router>
        );

        expect(screen.getByText('CryptoTransactionsHistory')).toBeInTheDocument();
    });

    it('should render <SendEmail /> component', () => {
        isDesktop.mockReturnValue(true);
        const history = createBrowserHistory();
        const props = mockDefaultProps();

        render(
            <Router history={history}>
                <Withdrawal {...props} />
            </Router>
        );

        expect(screen.getByText('SendEmail')).toBeInTheDocument();
    });

    it('should not trigger "setSideNotes" callback if "isDesktop = false"', () => {
        isDesktop.mockReturnValue(false);
        const history = createBrowserHistory();
        const props = mockDefaultProps();

        render(
            <Router history={history}>
                <Withdrawal {...props} />
            </Router>
        );

        expect(props.setSideNotes).not.toHaveBeenCalled();
    });

    it('should trigger "setSideNotes" callback in Desktop mode', () => {
        const renderWithCryptoCurrency = crypto_currency => {
            isDesktop.mockReturnValue(true);
            const history = createBrowserHistory();
            const props = mockDefaultProps();
            props.crypto_transactions = [{}];
            props.currency = crypto_currency;
            const { unmount } = render(
                <Router history={history}>
                    <Withdrawal {...props} />
                </Router>
            );

            expect(props.setSideNotes).toHaveBeenCalledTimes(1);
            unmount();
        };

        renderWithCryptoCurrency('BTC');
        renderWithCryptoCurrency('UST');
        renderWithCryptoCurrency('eUSDT');
    });
});
