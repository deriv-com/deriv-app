import React from 'react';
import { createMemoryHistory, To } from 'history';
import { Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import WalletCashierContent from '../WalletCashierContent';

jest.mock('../WalletCashierLazyRoutes', () => ({
    LazyDepositLocked: jest.fn(({ children }) => <div>{children}</div>),
    LazyWalletDeposit: jest.fn(() => <div>LazyWalletDeposit</div>),
    LazyWalletFiatOnRamp: jest.fn(() => <div>LazyWalletFiatOnRamp</div>),
    LazyWalletResetBalance: jest.fn(() => <div>LazyWalletResetBalance</div>),
    LazyWalletTransactions: jest.fn(() => <div>LazyWalletTransactions</div>),
    LazyWalletTransfer: jest.fn(() => <div>LazyWalletTransfer</div>),
    LazyWalletWithdrawal: jest.fn(() => <div>LazyWalletWithdrawal</div>),
    LazyWithdrawalLocked: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock('../../../modules', () => ({
    CashierLocked: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('WalletCashierContent', () => {
    const renderComponent = (route: To) => {
        const history = createMemoryHistory();
        history.push(route);
        render(
            <Router history={history}>
                <WalletCashierContent />
            </Router>
        );
    };

    it('redirects to deposit page if no other page is matched', () => {
        const history = createMemoryHistory();
        history.push('/wallet/unknown-route');
        render(
            <Router history={history}>
                <WalletCashierContent />
            </Router>
        );
        expect(history.location.pathname).toBe('/wallet/deposit');
    });

    it('renders WalletDeposit when route is /wallet/deposit', () => {
        renderComponent('/wallet/deposit');
        expect(screen.getByText('LazyWalletDeposit')).toBeInTheDocument();
    });

    it('renders WalletFiatOnRamp when route is /wallet/on-ramp', () => {
        renderComponent('/wallet/on-ramp');
        expect(screen.getByText('LazyWalletFiatOnRamp')).toBeInTheDocument();
    });

    it('renders WalletResetBalance when route is /wallet/reset-balance', () => {
        renderComponent('/wallet/reset-balance');
        expect(screen.getByText('LazyWalletResetBalance')).toBeInTheDocument();
    });

    it('renders WalletTransfer when route is /wallet/account-transfer', () => {
        renderComponent('/wallet/account-transfer');
        expect(screen.getByText('LazyWalletTransfer')).toBeInTheDocument();
    });

    it('renders WalletTransactions when route is /wallet/transactions', () => {
        renderComponent('/wallet/transactions');
        expect(screen.getByText('LazyWalletTransactions')).toBeInTheDocument();
    });

    it('renders WalletWithdrawal when route is /wallet/withdrawal', () => {
        renderComponent('/wallet/withdrawal');
        expect(screen.getByText('LazyWalletWithdrawal')).toBeInTheDocument();
    });
});
