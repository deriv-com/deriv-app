import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { routes } from '@deriv/shared';
import NoBalance from '../no-balance';
import { StoreProvider } from '@deriv/stores';

describe('<NoBalance />', () => {
    const history = createBrowserHistory();
    let mockRootStore;

    beforeEach(() => {
        mockRootStore = {
            client: { currency: 'USD' },
            modules: {
                cashier: {
                    deposit: { is_deposit_locked: false },
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

    it('must not able to make a deposit when deposit is locked', async () => {
        mockRootStore.modules.cashier.deposit.is_deposit_locked = true;

        render(
            <Router history={history}>
                <NoBalance />
            </Router>,
            {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            }
        );

        expect(screen.getByRole('heading')).toBeInTheDocument();
        expect(screen.queryByText('Deposit now')).not.toBeInTheDocument();
        expect(screen.queryByText('Please make a deposit to use this feature.')).not.toBeInTheDocument();
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
