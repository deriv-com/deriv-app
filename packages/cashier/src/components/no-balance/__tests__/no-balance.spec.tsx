import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { routes } from '@deriv/shared';
import { useDepositLocked } from '@deriv/hooks';
import NoBalance from '../no-balance';
import { StoreProvider } from '@deriv/stores';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useDepositLocked: jest.fn(() => false),
}));

describe('<NoBalance />', () => {
    const history = createBrowserHistory();
    let mockRootStore;

    beforeEach(() => {
        mockRootStore = {
            client: {
                currency: 'USD',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
            modules: {
                cashier: {
                    deposit: { is_deposit_locked: useDepositLocked.mockReturnValue(false) },
                    general_store: { setCashierTabIndex: jest.fn() },
                },
            },
        };
    });

    it('component should render', () => {
        render(
            <Router history={history}>
                <NoBalance />
            </Router>,
            {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            }
        );

        expect(screen.getByRole('heading')).toBeInTheDocument();
        expect(screen.getByText('Deposit now')).toBeInTheDocument();
        expect(screen.getByText('Please make a deposit to use this feature.')).toBeInTheDocument();
    });

    it('component should redirect to deposit page when button is clicked', () => {
        render(
            <Router history={history}>
                <NoBalance />
            </Router>,
            {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            }
        );

        const btn = screen.getByRole('button');
        fireEvent.click(btn);

        expect(history.location.pathname).toBe(routes.cashier_deposit);
    });
});
