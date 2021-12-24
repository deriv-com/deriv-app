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

    it(`icon styling should be dark when 'is_dark_mode_on' prop is true`, () => {
        const component = render(
            <Router history={history}>
                <Virtual has_real_account is_dark_mode_on />
            </Router>
        );

        expect(component.container.querySelector('.virtual__account-switch-icon--dark')).toBeInTheDocument();
    });

    it(`icon styling should be light when 'is_dark_mode_on' prop is false`, () => {
        const component = render(
            <Router history={history}>
                <Virtual has_real_account is_dark_mode_on={false} />
            </Router>
        );

        expect(component.container.querySelector('.virtual__account-switch-icon--light')).toBeInTheDocument();
    });

    it(`should render 'You are using demo account' section when 'has_real_account' prop is true`, () => {
        render(
            <Router history={history}>
                <Virtual has_real_account />
            </Router>
        );

        expect(screen.getByText('You are using a demo account')).toBeInTheDocument();
    });

    it(`should render 'Cashier is locked' section when 'has_real_account' prop is false`, () => {
        render(
            <Router history={history}>
                <Virtual has_real_account={false} />
            </Router>
        );

        expect(screen.getByText('Cashier is locked')).toBeInTheDocument();
    });

    it(`toggleAccountsDialog func should be triggered on click on text element 'switch' when using demo account`, () => {
        const toggleAccountsDialog = jest.fn();

        render(
            <Router history={history}>
                <Virtual has_real_account={false} toggleAccountsDialog={toggleAccountsDialog} />
            </Router>
        );

        const btn = screen.getByText('switch');
        fireEvent.click(btn);

        expect(toggleAccountsDialog).toBeCalledTimes(1);
    });

    it(`openRealAccountSignup func should redirect to trade page when click on text element 'create' when using demo account`, () => {
        const openRealAccountSignup = jest.fn();
        const trade = 'trade';

        render(
            <Router history={history}>
                <Virtual has_real_account={false} openRealAccountSignup={openRealAccountSignup} />
            </Router>
        );

        const btn = screen.getByText('create');
        fireEvent.click(btn);

        expect(history.location.pathname).toBe(routes[trade]);
    });
});
