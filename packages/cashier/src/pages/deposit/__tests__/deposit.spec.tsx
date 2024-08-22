import React from 'react';
import { render, screen } from '@testing-library/react';
import { useDepositLocked } from '@deriv/hooks';
import { mockStore } from '@deriv/stores';
import CashierProviders from '../../../cashier-providers';
import Deposit from '../deposit';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useDepositLocked: jest.fn(() => false),
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
});
