import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import DTraderHeader from '../dtrader-header';

jest.mock('App/Components/Layout/Header', () => ({
    MenuLinks: jest.fn(() => <div>Mocked Menu Links</div>),
    PlatformSwitcher: jest.fn(() => <div>Mocked Platform Switcher</div>),
}));
jest.mock('App/Containers/RealAccountSignup', () => jest.fn(() => <div>Mocked Real Account SignUp</div>));
jest.mock('App/Components/Layout/Header/toggle-menu-drawer.jsx', () =>
    jest.fn(() => <div>Mocked Toggle Menu Drawer</div>)
);
jest.mock('../header-account-actions', () => jest.fn(() => <div>Mocked Header Account Action</div>));
jest.mock('../traders-hub-home-button', () => jest.fn(() => <div>Mocked Traders Home Button</div>));

describe('DTraderHeader', () => {
    const store = mockStore({ ui: { is_desktop: true } });
    const renderComponent = (modified_store = store) =>
        render(
            <StoreProvider store={modified_store}>
                <DTraderHeader />
            </StoreProvider>
        );

    it('should render Platform switcher, Traders Home button, Menu Links, Account actions and Real Account SignUp components, in Desktop view', () => {
        renderComponent();
        expect(screen.getByText('Mocked Platform Switcher')).toBeInTheDocument();
        expect(screen.getByText('Mocked Traders Home Button')).toBeInTheDocument();
        expect(screen.getByText('Mocked Menu Links')).toBeInTheDocument();
        expect(screen.getByText('Mocked Header Account Action')).toBeInTheDocument();
        expect(screen.getByText('Mocked Real Account SignUp')).toBeInTheDocument();
    });

    it('should render Toggle Menu Drawer, Menu Links, Header Account Action and Real Account SignUp components, in Mobile view', () => {
        renderComponent(
            mockStore({
                ui: { is_desktop: false, is_mobile: true },
                modules: { cashier: { payment_agent: 'MOCK_PAYMENT_AGENT' } },
            })
        );
        expect(screen.getByText('Mocked Toggle Menu Drawer')).toBeInTheDocument();
        expect(screen.getByText('Mocked Menu Links')).toBeInTheDocument();
        expect(screen.getByText('Mocked Header Account Action')).toBeInTheDocument();
        expect(screen.getByText('Mocked Real Account SignUp')).toBeInTheDocument();
    });
});
