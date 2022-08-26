import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Withdrawal from '../withdrawal';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { isDesktop, routes } from '@deriv/shared';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('Components/cashier-locked', () => () => <div>CashierLocked</div>);
jest.mock('Components/cashier-container/virtual', () => () => <div>Virtual</div>);
jest.mock('../withdrawal-locked', () => () => <div>WithdrawalLocked</div>);
jest.mock('Components/no-balance', () => () => <div>NoBalance</div>);
jest.mock('Components/error', () => () => <div>Error</div>);
jest.mock('../withdraw', () => () => <div>Withdraw</div>);
jest.mock('../crypto-withdraw-form', () => () => <div>CryptoWithdrawForm</div>);
jest.mock('../crypto-withdraw-receipt', () => () => <div>CryptoWithdrawReceipt</div>);
jest.mock('Components/crypto-transactions-history', () => () => <div>CryptoTransactionsHistory</div>);
jest.mock('../withdrawal-verification-email', () => () => <div>WithdrawalVerificationEmail</div>);
jest.mock('Components/recent-transaction', () => () => <div>RecentTransaction</div>);
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));
jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isDesktop: jest.fn(() => true),
}));

describe('<Withdrawal />', () => {
    let modal_root_el;
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
        is_risk_client: false,
        is_financial_assessment_incomplete: false,
    };

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

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

    it('should show the Withdrawal block dialog when the user is categorized as a high risk client', () => {
        const history = createBrowserHistory();

        render(
            <Router history={history}>
                <Withdrawal {...props} is_risk_client is_financial_assessment_incomplete />
            </Router>
        );

        expect(screen.getByRole('button', { name: /start assessment/i })).toBeInTheDocument();
    });

    it('should redirect user to financial assessment page on button click', () => {
        const history = createBrowserHistory();

        render(
            <Router history={history}>
                <Withdrawal {...props} is_risk_client is_financial_assessment_incomplete />
            </Router>
        );

        const el_start_assessment_btn = screen.getByRole('button', { name: /start assessment/i });

        fireEvent.click(el_start_assessment_btn);
        expect(history.location.pathname).toBe(routes.financial_assessment);
    });
});
