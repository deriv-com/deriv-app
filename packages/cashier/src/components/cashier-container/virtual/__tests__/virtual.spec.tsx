import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import Virtual from '../virtual';
import { StoreProvider } from '@deriv/stores';

describe('<Virtual />', () => {
    const history = createBrowserHistory();
    let mockRootStore;

    beforeEach(() => {
        mockRootStore = {
            ui: { is_dark_mode_on: true, toggleAccountsDialog: jest.fn() },
            client: { is_pre_appstore: true },
        };
    });

    it('component should render', () => {
        render(
            <Router history={history}>
                <Virtual />
            </Router>,
            {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            }
        );

        expect(screen.getByTestId('dt_cashier_wrapper_id')).toBeInTheDocument();
    });

    it(`icon styling should be dark when 'is_dark_mode_on' prop is true`, () => {
        render(
            <Router history={history}>
                <Virtual />
            </Router>,
            {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            }
        );

        expect(screen.getByTestId('dt_virtual_account_switch_icon_dark_id')).toBeInTheDocument();
    });

    it(`icon styling should be light when 'is_dark_mode_on' prop is false`, () => {
        mockRootStore.ui.is_dark_mode_on = false;

        render(
            <Router history={history}>
                <Virtual />
            </Router>,
            {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            }
        );

        expect(screen.getByTestId('dt_virtual_account_switch_icon_light_id')).toBeInTheDocument();
    });

    it(`toggleAccountsDialog func should be triggered on click on text element 'Account Switcher.'`, () => {
        render(
            <Router history={history}>
                <Virtual />
            </Router>,
            {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            }
        );

        const btn = screen.getByText('Account Switcher.');
        fireEvent.click(btn);

        expect(mockRootStore.ui.toggleAccountsDialog).toBeCalledTimes(1);
    });
});
