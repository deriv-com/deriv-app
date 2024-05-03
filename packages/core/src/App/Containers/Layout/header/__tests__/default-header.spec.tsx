import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import DefaultHeader from '../default-header';
import { useDevice } from '@deriv-com/ui';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('App/Components/Layout/Header', () => ({
    MenuLinks: jest.fn(() => <div>Mocked Menu Links</div>),
    PlatformSwitcher: jest.fn(() => <div>Mocked Platform Switcher</div>),
}));
jest.mock('App/Containers/RealAccountSignup', () => jest.fn(() => <div>Mocked Real Account SignUp</div>));
jest.mock('App/Components/Layout/Header/toggle-menu-drawer.jsx', () =>
    jest.fn(() => <div>Mocked Toggle Menu Drawer</div>)
);
jest.mock('../header-account-actions', () => jest.fn(() => <div>Mocked Header Account Action</div>));

describe('DefaultHeader', () => {
    const mock_store = mockStore({ ui: { is_real_acc_signup_on: true } });
    const renderComponent = (modified_store = mock_store) =>
        render(
            <StoreProvider store={modified_store}>
                <DefaultHeader />
            </StoreProvider>
        );

    it('should render Platform switcher, Menu Links, Account action and Real Account SignUp components, in Desktop view', () => {
        renderComponent();
        expect(screen.getByText('Mocked Platform Switcher')).toBeInTheDocument();
        expect(screen.getByText('Mocked Menu Links')).toBeInTheDocument();
        expect(screen.getByText('Mocked Header Account Action')).toBeInTheDocument();
        expect(screen.getByText('Mocked Real Account SignUp')).toBeInTheDocument();
    });

    it('should render Toggle Menu Drawer, Menu Links, Account action and Real Account SignUp components, in Mobile view', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        renderComponent(
            mockStore({
                ui: { is_real_acc_signup_on: true },
                modules: { cashier: { payment_agent: 'MOCK_PAYMENT_AGENT' } },
            })
        );
        expect(screen.getByText('Mocked Toggle Menu Drawer')).toBeInTheDocument();
        expect(screen.getByText('Mocked Menu Links')).toBeInTheDocument();
        expect(screen.getByText('Mocked Header Account Action')).toBeInTheDocument();
        expect(screen.getByText('Mocked Real Account SignUp')).toBeInTheDocument();
    });
});
