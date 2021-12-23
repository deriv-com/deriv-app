import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { routes } from '@deriv/shared';
import Virtual from '../virtual';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<Virtual />', () => {
    const history = createBrowserHistory();

    it('component should render', () => {
        const component = render(
            <Router history={history}>
                <Virtual />
            </Router>
        );

        expect(component.container.querySelector('.cashier__wrapper')).toBeInTheDocument();
    });

    it(`icon styling should change depending on 'is_dark_mode_on' prop`, () => {
        const has_real_account = true;
        const is_dark_mode_on = true;

        const component = render(
            <Router history={history}>
                <Virtual has_real_account={has_real_account} is_dark_mode_on={is_dark_mode_on} />
            </Router>
        );

        if (is_dark_mode_on) {
            expect(component.container.querySelector('.virtual__account-switch-icon--dark')).toBeInTheDocument();
        } else {
            expect(component.container.querySelector('.virtual__account-switch-icon--light')).toBeInTheDocument();
        }
    });

    it(`should render 'You are using demo account' section when 'has_real_account' prop is true, otherwise render 'Cashier is locked' section`, () => {
        const has_real_account = true;

        render(
            <Router history={history}>
                <Virtual has_real_account={has_real_account} />
            </Router>
        );
        if (has_real_account) {
            expect(screen.getByText('You are using a demo account')).toBeInTheDocument();
        } else {
            expect(screen.getByText('Cashier is locked')).toBeInTheDocument();
        }
    });

    it(`toggleAccountsDialog func should be triggered on click on text element 'switch' when using demo account`, () => {
        const has_real_account = false;
        const toggleAccountsDialog = jest.fn();

        render(
            <Router history={history}>
                <Virtual has_real_account={has_real_account} toggleAccountsDialog={toggleAccountsDialog} />
            </Router>
        );

        const btn = screen.getByText('switch');
        fireEvent.click(btn);

        expect(toggleAccountsDialog).toBeCalledTimes(1);
    });

    it(`openRealAccountSignup func should redirect to trade page when click on text element 'create' when using demo account`, () => {
        const has_real_account = false;
        const openRealAccountSignup = jest.fn();
        const trade = 'trade';

        render(
            <Router history={history}>
                <Virtual has_real_account={has_real_account} openRealAccountSignup={openRealAccountSignup} />
            </Router>
        );

        const btn = screen.getByText('create');
        fireEvent.click(btn);

        expect(history.location.pathname).toBe(routes[trade]);
    });
});
