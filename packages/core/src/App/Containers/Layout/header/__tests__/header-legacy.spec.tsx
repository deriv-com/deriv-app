import React from 'react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { useDevice } from '@deriv-com/ui';
import HeaderLegacy from '../header-legacy';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('App/Components/Layout/Header', () => ({
    MenuLinks: jest.fn(() => <div>Mocked Menu Links</div>),
}));
jest.mock('App/Containers/RealAccountSignup', () => jest.fn(() => <div>Mocked Real Account SignUp</div>));
jest.mock('App/Components/Layout/Header/toggle-menu-drawer.jsx', () =>
    jest.fn(() => <div>Mocked Toggle Menu Drawer</div>)
);
jest.mock('../header-account-actions', () => jest.fn(() => <div>Mocked Header Account Action</div>));
jest.mock('../traders-hub-home-button', () => jest.fn(() => <div>Mocked Traders Home Button</div>));
jest.mock('../deriv-short-logo', () => jest.fn(() => <div>Deriv Short Logo</div>));

describe('HeaderLegacy', () => {
    const history = createBrowserHistory();
    const mock_store = mockStore({ ui: { is_real_acc_signup_on: true } });
    const renderComponent = (modified_store = mock_store) =>
        render(
            <Router history={history}>
                <StoreProvider store={modified_store}>
                    <HeaderLegacy />
                </StoreProvider>
            </Router>
        );

    it('should render Traders Home button, Menu Links, Account actions and Real Account SignUp components, in Desktop view', () => {
        renderComponent();
        const desktop_view_text_content = [
            'Mocked Traders Home Button',
            'Mocked Menu Links',
            'Mocked Header Account Action',
            'Mocked Real Account SignUp',
        ];
        desktop_view_text_content.forEach(text => expect(screen.getByText(text)).toBeInTheDocument());
    });

    it('should render Toggle Menu Drawer, Menu Links, Header Account Action and Real Account SignUp components, in Mobile view', () => {
        (useDevice as jest.Mock).mockImplementationOnce(() => ({ isDesktop: false }));
        renderComponent(
            mockStore({
                ui: { is_desktop: false, is_real_acc_signup_on: true },
                modules: { cashier: { payment_agent: 'MOCK_PAYMENT_AGENT' } },
            })
        );
        const mobile_view_text_content = [
            'Mocked Toggle Menu Drawer',
            'Mocked Menu Links',
            'Mocked Header Account Action',
            'Mocked Real Account SignUp',
        ];
        mobile_view_text_content.forEach(text => expect(screen.getByText(text)).toBeInTheDocument());
    });
});
