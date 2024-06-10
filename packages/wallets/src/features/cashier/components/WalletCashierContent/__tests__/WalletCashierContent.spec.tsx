import React from 'react';
import { createMemoryHistory, To } from 'history';
import { Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { WalletDeposit } from '../../../flows/WalletDeposit';
import { WalletFiatOnRamp } from '../../../flows/WalletFiatOnRamp';
import { WalletResetBalance } from '../../../flows/WalletResetBalance';
import { WalletTransactions } from '../../../flows/WalletTransactions';
import { WalletTransfer } from '../../../flows/WalletTransfer';
import { WalletWithdrawal } from '../../../flows/WalletWithdrawal';
import WalletCashierContent from '../WalletCashierContent';

jest.mock('../../../flows/WalletDeposit');
jest.mock('../../../flows/WalletFiatOnRamp');
jest.mock('../../../flows/WalletResetBalance');
jest.mock('../../../flows/WalletTransactions');
jest.mock('../../../flows/WalletTransfer');
jest.mock('../../../flows/WalletWithdrawal');
jest.mock('../../../modules', () => ({
    CashierLocked: jest.fn(({ children }) => <div>{children}</div>),
    DepositLocked: jest.fn(({ children }) => <div>{children}</div>),
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

    beforeEach(() => {
        (WalletDeposit as jest.Mock).mockReturnValue(<div>WalletDeposit</div>);
        (WalletFiatOnRamp as jest.Mock).mockReturnValue(<div>WalletFiatOnRamp</div>);
        (WalletResetBalance as jest.Mock).mockReturnValue(<div>WalletResetBalance</div>);
        (WalletTransactions as jest.Mock).mockReturnValue(<div>WalletTransactions</div>);
        (WalletTransfer as jest.Mock).mockReturnValue(<div>WalletTransfer</div>);
        (WalletWithdrawal as jest.Mock).mockReturnValue(<div>WalletWithdrawal</div>);
    });

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
