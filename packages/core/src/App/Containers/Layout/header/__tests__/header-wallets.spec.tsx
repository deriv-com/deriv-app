import React from 'react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useDevice } from '@deriv-com/ui';
import HeaderWallets from '../header-wallets';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(() => ({ pathname: '/some-path' })),
    withRouter: (Component: React.ComponentType<any>) => Component,
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true, isMobile: false })),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    platforms: { mt5: 'mt5' },
    routes: {
        cashier_deposit: '/cashier/deposit',
        traders_hub: '/traders-hub',
        account: '/account',
        wallets: '/wallets',
        settings: '/settings',
        wallets_compare_accounts: '/wallets/compare-accounts',
        compare_cfds: '/compare-cfds',
        mt5: '/mt5',
        dxtrade: '/dxtrade',
        bot: '/bot',
        smarttrader: 'https://smarttrader.deriv.com',
    },
}));

jest.mock('App/Components/Layout/Header', () => ({
    MenuLinks: jest.fn(() => <div>Mocked Menu Links</div>),
}));

jest.mock('App/Components/Layout/Header/wallets/accounts-info-loader-wallets', () =>
    jest.fn(() => <div>Mocked Accounts Info Loader Wallets</div>)
);

jest.mock('App/Components/Layout/Header/wallets/account-actions-wallets', () => ({
    AccountActionsWallets: jest.fn(({ is_traders_hub_routes }) => (
        <div data-testid='dt_account_actions_wallets'>
            Mocked Account Actions Wallets {is_traders_hub_routes ? 'true' : 'false'}
        </div>
    )),
}));

jest.mock('App/Containers/RealAccountSignup', () => jest.fn(() => <div>Mocked Real Account SignUp</div>));

jest.mock('App/Containers/SetAccountCurrencyModal', () => jest.fn(() => <div>Mocked Set Account Currency Modal</div>));

jest.mock('App/Containers/new-version-notification.jsx', () =>
    jest.fn(({ onUpdate }) => (
        <div data-testid='dt_new_version_notification' onClick={onUpdate}>
            Mocked New Version Notification
        </div>
    ))
);

jest.mock('App/Components/Layout/Header/toggle-menu-drawer.jsx', () =>
    jest.fn(() => <div data-testid='dt_toggle_menu_drawer'>Mocked Toggle Menu Drawer</div>)
);

jest.mock('../traders-hub-home-button', () => jest.fn(() => <div>Mocked Traders Home Button</div>));

jest.mock('../deriv-short-logo', () => jest.fn(() => <div>Deriv Short Logo</div>));

describe('HeaderWallets', () => {
    const history = createBrowserHistory();
    const default_mock = {
        client: {
            is_logged_in: true,
            is_logging_in: false,
            is_single_logging_in: false,
            is_switching: false,
            is_bot_allowed: true,
            is_mt5_allowed: true,
            is_dxtrade_allowed: true,
            is_crypto: jest.fn(() => false),
        },
        common: {
            platform: '' as '' | 'dxtrade' | 'mt5' | 'ctrader',
        },
        ui: {
            is_app_disabled: false,
            is_route_modal_on: false,
            is_mobile: false,
            header_extension: null,
        },
        notifications: {
            addNotificationMessage: jest.fn(),
            client_notifications: {
                new_version_available: {
                    key: 'new_version_available',
                    type: 'warning',
                    message: 'New version available',
                },
            },
            removeNotificationMessage: jest.fn(),
        },
    };

    const mock_store = mockStore(default_mock);

    const renderComponent = (modified_store = mock_store) =>
        render(
            <Router history={history}>
                <StoreProvider store={modified_store}>
                    <HeaderWallets />
                </StoreProvider>
            </Router>
        );

    it('should render MenuLeft and MenuRight components in desktop view', () => {
        renderComponent();

        expect(screen.getByText('Deriv Short Logo')).toBeInTheDocument();
        expect(screen.getByText('Mocked Traders Home Button')).toBeInTheDocument();
        expect(screen.getByText('Mocked Menu Links')).toBeInTheDocument();
        expect(screen.getByText('Mocked Account Actions Wallets false')).toBeInTheDocument();
    });

    it('should render Toggle Menu Drawer in mobile view', () => {
        (useDevice as jest.Mock).mockImplementationOnce(() => ({ isDesktop: false, isMobile: true }));

        renderComponent();

        expect(screen.getByTestId('dt_toggle_menu_drawer')).toBeInTheDocument();
        expect(screen.getByText('Mocked Menu Links')).toBeInTheDocument();
        expect(screen.getByText('Mocked Account Actions Wallets false')).toBeInTheDocument();
    });

    it('should render header extensions when is_logged_in is true and header_extension exists in mobile view', () => {
        (useDevice as jest.Mock).mockImplementationOnce(() => ({ isDesktop: false, isMobile: true }));

        renderComponent(
            mockStore({
                ...default_mock,
                ui: {
                    ...default_mock.ui,
                    header_extension: <div data-testid='dt_header_extension'>Header Extension</div>,
                },
            })
        );

        expect(screen.getByTestId('dt_header_extension')).toBeInTheDocument();
    });

    it('should render AccountsInfoLoaderWallets when is_logging_in is true', () => {
        renderComponent(
            mockStore({
                ...default_mock,
                client: {
                    ...default_mock.client,
                    is_logging_in: true,
                },
            })
        );

        expect(screen.getByText('Mocked Accounts Info Loader Wallets')).toBeInTheDocument();
        expect(screen.queryByText('Mocked Account Actions Wallets false')).not.toBeInTheDocument();
    });

    it('should render AccountsInfoLoaderWallets when is_single_logging_in is true', () => {
        renderComponent(
            mockStore({
                ...default_mock,
                client: {
                    ...default_mock.client,
                    is_single_logging_in: true,
                },
            })
        );

        expect(screen.getByText('Mocked Accounts Info Loader Wallets')).toBeInTheDocument();
        expect(screen.queryByText('Mocked Account Actions Wallets false')).not.toBeInTheDocument();
    });

    it('should render AccountsInfoLoaderWallets when is_switching is true', () => {
        renderComponent(
            mockStore({
                ...default_mock,
                client: {
                    ...default_mock.client,
                    is_switching: true,
                },
            })
        );

        expect(screen.getByText('Mocked Accounts Info Loader Wallets')).toBeInTheDocument();
        expect(screen.queryByText('Mocked Account Actions Wallets false')).not.toBeInTheDocument();
    });

    it('should add header--is-disabled class when is_app_disabled is true', () => {
        renderComponent(
            mockStore({
                ...default_mock,
                ui: {
                    ...default_mock.ui,
                    is_app_disabled: true,
                },
            })
        );

        const header = screen.getByRole('banner');
        expect(header).toHaveClass('header--is-disabled');
    });

    it('should add header--is-disabled class when is_route_modal_on is true', () => {
        renderComponent(
            mockStore({
                ...default_mock,
                ui: {
                    ...default_mock.ui,
                    is_route_modal_on: true,
                },
            })
        );

        const header = screen.getByRole('banner');
        expect(header).toHaveClass('header--is-disabled');
    });

    it('should call addNotificationMessage when NewVersionNotification is clicked', async () => {
        renderComponent();

        const notification = screen.getByTestId('dt_new_version_notification');
        await userEvent.click(notification);

        expect(mock_store.notifications.addNotificationMessage).toHaveBeenCalledWith(
            mock_store.notifications.client_notifications.new_version_available
        );
    });

    it('should add header--is-hidden class when platforms[platform] is true', () => {
        renderComponent(
            mockStore({
                ...default_mock,
                common: {
                    platform: 'mt5',
                },
            })
        );

        const header = screen.getByRole('banner');
        expect(header).toHaveClass('header--is-hidden');
    });

    it('should pass is_traders_hub_routes=true to AccountActionsWallets when pathname is traders_hub', () => {
        const reactRouterDom = jest.requireMock('react-router-dom') as jest.Mocked<typeof import('react-router-dom')>;
        reactRouterDom.useLocation.mockReturnValue({
            pathname: '/traders-hub',
        });

        renderComponent();

        expect(screen.getByText('Mocked Account Actions Wallets true')).toBeInTheDocument();
    });

    it('should pass is_traders_hub_routes=true to AccountActionsWallets when pathname starts with /account', () => {
        const reactRouterDom = jest.requireMock('react-router-dom') as jest.Mocked<typeof import('react-router-dom')>;
        reactRouterDom.useLocation.mockReturnValue({
            pathname: '/account/personal-details',
        });

        renderComponent();

        expect(screen.getByText('Mocked Account Actions Wallets true')).toBeInTheDocument();
    });

    it('should pass is_traders_hub_routes=true to AccountActionsWallets when pathname starts with /wallets', () => {
        const reactRouterDom = jest.requireMock('react-router-dom') as jest.Mocked<typeof import('react-router-dom')>;
        reactRouterDom.useLocation.mockReturnValue({
            pathname: '/wallets/cashier',
        });

        renderComponent();

        expect(screen.getByText('Mocked Account Actions Wallets true')).toBeInTheDocument();
    });
});
