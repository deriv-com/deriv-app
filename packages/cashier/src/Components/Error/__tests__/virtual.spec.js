import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
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
                <Virtual is_dark_mode_on />
            </Router>
        );

        expect(component.container.querySelector('.virtual__account-switch-icon--dark')).toBeInTheDocument();
    });

    it(`icon styling should be light when 'is_dark_mode_on' prop is false`, () => {
        const component = render(
            <Router history={history}>
                <Virtual is_dark_mode_on={false} />
            </Router>
        );

        expect(component.container.querySelector('.virtual__account-switch-icon--light')).toBeInTheDocument();
    });

    it(`toggleAccountsDialog func should be triggered on click on text element 'Account Switcher.'`, () => {
        const toggleAccountsDialog = jest.fn();

        render(
            <Router history={history}>
                <Virtual toggleAccountsDialog={toggleAccountsDialog} />
            </Router>
        );

        const btn = screen.getByText('Account Switcher.');
        fireEvent.click(btn);

        expect(toggleAccountsDialog).toBeCalledTimes(1);
    });
});
