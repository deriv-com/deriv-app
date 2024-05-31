import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import DefaultHeader from '../default-header';
import { routes } from '@deriv/shared';

jest.mock('App/Components/Layout/Header', () => ({
    MenuLinks: jest.fn(() => <div>Mocked Menu Links</div>),
    PlatformSwitcher: jest.fn(() => <div>Mocked Platform Switcher</div>),
}));
jest.mock('App/Containers/RealAccountSignup', () => jest.fn(() => <div>Mocked Real Account SignUp</div>));
jest.mock('App/Components/Layout/Header/toggle-menu-drawer.jsx', () =>
    jest.fn(() => <div>Mocked Toggle Menu Drawer</div>)
);

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn().mockReturnValue({ pathname: '' }),
}));
jest.mock('../header-account-actions', () => jest.fn(() => <div>Mocked Header Account Action</div>));
jest.mock('../deriv-short-logo', () => jest.fn(() => <div>Deriv Short Logo</div>));

describe('DefaultHeader', () => {
    const mock_store = mockStore({ ui: { is_desktop: true, is_real_acc_signup_on: true } });
    const renderComponent = (modified_store = mock_store) =>
        render(
            <StoreProvider store={modified_store}>
                <DefaultHeader />
            </StoreProvider>
        );

    it('should render Platform switcher, Menu Links, Account action and Real Account SignUp components, in Desktop view for non-tradershub route', () => {
        (useLocation as jest.Mock).mockReturnValue({
            pathname: routes.bot,
        });
        renderComponent();
        expect(screen.getByText('Mocked Platform Switcher')).toBeInTheDocument();
        expect(screen.getByText('Mocked Menu Links')).toBeInTheDocument();
        expect(screen.getByText('Mocked Header Account Action')).toBeInTheDocument();
        expect(screen.getByText('Mocked Real Account SignUp')).toBeInTheDocument();
    });

    it('should render Menu Links, Account action and Real Account SignUp components, in Desktop view for tradershub route', () => {
        (useLocation as jest.Mock).mockReturnValue({
            pathname: routes.traders_hub,
        });
        renderComponent();
        expect(screen.queryByText('Mocked Platform Switcher')).not.toBeInTheDocument();
        expect(screen.getByText('Mocked Menu Links')).toBeInTheDocument();
        expect(screen.getByText('Mocked Header Account Action')).toBeInTheDocument();
        expect(screen.getByText('Mocked Real Account SignUp')).toBeInTheDocument();
    });

    it('should render Toggle Menu Drawer, Menu Links, Account action and Real Account SignUp components, in Mobile view', () => {
        renderComponent(
            mockStore({
                ui: { is_desktop: false, is_mobile: true, is_real_acc_signup_on: true },
                modules: { cashier: { payment_agent: 'MOCK_PAYMENT_AGENT' } },
            })
        );
        expect(screen.getByText('Mocked Toggle Menu Drawer')).toBeInTheDocument();
        expect(screen.getByText('Mocked Menu Links')).toBeInTheDocument();
        expect(screen.getByText('Mocked Header Account Action')).toBeInTheDocument();
        expect(screen.getByText('Mocked Real Account SignUp')).toBeInTheDocument();
    });
});
