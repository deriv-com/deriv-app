import React from 'react';
import { createMemoryHistory, To } from 'history';
import { Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import WalletCashierContent from '../WalletCashierContent';

jest.mock('../../../flows/WalletDeposit', () => ({
    WalletDeposit: jest.fn(() => <div>WalletDeposit</div>),
}));

jest.mock('../../../flows/WalletFiatOnRamp', () => ({
    WalletFiatOnRamp: jest.fn(() => <div>WalletFiatOnRamp</div>),
}));

jest.mock('../../../flows/WalletResetBalance', () => ({
    WalletResetBalance: jest.fn(() => <div>WalletResetBalance</div>),
}));

jest.mock('../../../flows/WalletTransactions', () => ({
    WalletTransactions: jest.fn(() => <div>WalletTransactions</div>),
}));

jest.mock('../../../flows/WalletTransfer', () => ({
    WalletTransfer: jest.fn(() => <div>WalletTransfer</div>),
}));

jest.mock('../../../flows/WalletWithdrawal', () => ({
    WalletWithdrawal: jest.fn(() => <div>WalletWithdrawal</div>),
}));

jest.mock('../../../modules', () => ({
    CashierLocked: jest.fn(({ children }) => <div>{children}</div>),
    DepositLocked: jest.fn(({ children }) => <div>{children}</div>),
    TransferLocked: jest.fn(({ children }) => <div>{children}</div>),
    WithdrawalLocked: jest.fn(({ children }) => <div>{children}</div>),
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
        expect(screen.getByText('WalletDeposit')).toBeInTheDocument();
    });

    it('renders WalletFiatOnRamp when route is /wallet/on-ramp', () => {
        renderComponent('/wallet/on-ramp');
        expect(screen.getByText('WalletFiatOnRamp')).toBeInTheDocument();
    });

    it('renders WalletResetBalance when route is /wallet/reset-balance', () => {
        renderComponent('/wallet/reset-balance');
        expect(screen.getByText('WalletResetBalance')).toBeInTheDocument();
    });

    it('renders WalletTransfer when route is /wallet/account-transfer', () => {
        renderComponent('/wallet/account-transfer');
        expect(screen.getByText('WalletTransfer')).toBeInTheDocument();
    });

    it('renders WalletTransactions when route is /wallet/transactions', () => {
        renderComponent('/wallet/transactions');
        expect(screen.getByText('WalletTransactions')).toBeInTheDocument();
    });

    it('renders WalletWithdrawal when route is /wallet/withdrawal', () => {
        renderComponent('/wallet/withdrawal');
        expect(screen.getByText('WalletWithdrawal')).toBeInTheDocument();
    });
});
