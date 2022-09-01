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
        render(
            <Router history={history}>
                <Virtual />
            </Router>
        );

        expect(screen.getByTestId('dt_cashier_wrapper_id')).toBeInTheDocument();
    });

    it(`icon styling should be dark when 'is_dark_mode_on' prop is true`, () => {
        render(
            <Router history={history}>
                <Virtual is_dark_mode_on />
            </Router>
        );

        expect(screen.getByTestId('dt_virtual_account_switch_icon_dark_id')).toBeInTheDocument();
    });

    it(`icon styling should be light when 'is_dark_mode_on' prop is false`, () => {
        render(
            <Router history={history}>
                <Virtual is_dark_mode_on={false} />
            </Router>
        );

        expect(screen.getByTestId('dt_virtual_account_switch_icon_light_id')).toBeInTheDocument();
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
