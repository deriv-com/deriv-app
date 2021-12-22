import React from 'react';
import { screen, render, fireEvent, cleanup } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { routes } from '@deriv/shared';
import NoBalance from '../no-balance';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<NoBalance />', () => {
    const history = createBrowserHistory();

    it('component should render', () => {
        const is_deposit_locked = false;

        render(
            <Router history={history}>
                <NoBalance is_deposit_locked={is_deposit_locked} />
            </Router>
        );

        expect(screen.getByRole('heading')).toBeInTheDocument();
        expect(screen.getByText('Deposit now')).toBeInTheDocument();
        expect(screen.getByText('Please make a deposit to use this feature.')).toBeInTheDocument();
    });

    it('must not able to make a deposit when deposit is locked', async () => {
        const is_deposit_locked = true;

        render(
            <Router history={history}>
                <NoBalance is_deposit_locked={is_deposit_locked} />
            </Router>
        );

        expect(screen.getByRole('heading')).toBeInTheDocument();
        expect(screen.queryByText('Deposit now')).not.toBeInTheDocument();
        expect(screen.queryByText('Please make a deposit to use this feature.')).not.toBeInTheDocument();
    });

    it('component should redirect to deposit page when button is clicked', () => {
        const is_deposit_locked = false;
        const cashier_deposit = 'cashier_deposit';
        const setTabIndex = jest.fn();

        render(
            <Router history={history}>
                <NoBalance is_deposit_locked={is_deposit_locked} setTabIndex={setTabIndex} />
            </Router>
        );

        const btn = screen.getByRole('button');
        fireEvent.click(btn);

        expect(history.location.pathname).toBe(routes[cashier_deposit]);
    });
});
