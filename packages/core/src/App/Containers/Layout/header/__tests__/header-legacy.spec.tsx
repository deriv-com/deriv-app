import React from 'react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useDevice } from '@deriv-com/ui';
import HeaderLegacy from '../header-legacy';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(() => ({ pathname: '/some-path' })),
    useHistory: jest.fn(() => ({
        push: jest.fn(),
    })),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getDecimalPlaces: jest.fn(() => 2),
    platforms: { mt5: 'mt5' },
    routes: {
        cashier_deposit: '/cashier/deposit',
        traders_hub: '/traders-hub',
        account: '/account',
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

jest.mock('App/Components/Layout/Header/Components/Preloader', () => ({
    AccountsInfoLoader: jest.fn(() => <div>Mocked Accounts Info Loader</div>),
}));

jest.mock('App/Containers/RealAccountSignup', () => jest.fn(() => <div>Mocked Real Account SignUp</div>));

jest.mock('App/Containers/SetAccountCurrencyModal', () => jest.fn(() => <div>Mocked Set Account Currency Modal</div>));

jest.mock('App/Containers/new-version-notification.jsx', () =>
    jest.fn(() => <div>Mocked New Version Notification</div>)
);

jest.mock('App/Components/Layout/Header/toggle-menu-drawer.jsx', () =>
    jest.fn(() => <div data-testid='dt_toggle_menu_drawer'>Mocked Toggle Menu Drawer</div>)
);

jest.mock('App/Components/Layout/Header/toggle-menu-drawer-accounts-os.jsx', () =>
    jest.fn(() => <div data-testid='dt_toggle_menu_drawer_os'>Mocked Toggle Menu Drawer OS</div>)
);

jest.mock('../header-account-actions', () =>
    jest.fn(({ onClickDeposit }) => (
        <div data-testid='dt_header_account_actions' onClick={onClickDeposit}>
            Mocked Header Account Action
        </div>
    ))
);

jest.mock('../traders-hub-home-button', () => jest.fn(() => <div>Mocked Traders Home Button</div>));

jest.mock('../deriv-short-logo', () => jest.fn(() => <div>Deriv Short Logo</div>));

describe('HeaderLegacy', () => {
    const history = createBrowserHistory();
    const default_mock = {
        client: {
            currency: 'USD',
            has_any_real_account: true,
            is_bot_allowed: true,
            is_dxtrade_allowed: true,
            is_logged_in: true,
            is_logging_in: false,
            is_single_logging_in: false,
            is_mt5_allowed: true,
            is_virtual: false,
            is_switching: false,
        },
        common: {
            platform: '' as '' | 'dxtrade' | 'mt5' | 'ctrader',
            is_from_tradershub_os: false,
        },
        ui: {
            header_extension: null,
            is_app_disabled: false,
            is_route_modal_on: false,
            toggleReadyToDepositModal: jest.fn(),
            is_real_acc_signup_on: true,
        },
        notifications: {
            addNotificationMessage: jest.fn(),
            client_notifications: {
                new_version_available: {
                    key: 'new_version_available',
                    type: 'warning',
                    message: 'New version available',
                    should_show_again: true,
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
                ...default_mock,
                ui: {
                    ...default_mock.ui,
                    is_desktop: false,
                },
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

    it('should render Toggle Menu Drawer OS when is_from_tradershub_os is true in mobile view', () => {
        (useDevice as jest.Mock).mockImplementationOnce(() => ({ isDesktop: false }));
        renderComponent(
            mockStore({
                ...default_mock,
                common: {
                    ...default_mock.common,
                    is_from_tradershub_os: true,
                },
            })
        );

        expect(screen.getByTestId('dt_toggle_menu_drawer_os')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_toggle_menu_drawer')).not.toBeInTheDocument();
    });

    it('should render AccountsInfoLoader when is_logging_in is true', () => {
        renderComponent(
            mockStore({
                ...default_mock,
                client: {
                    ...default_mock.client,
                    is_logging_in: true,
                },
            })
        );

        expect(screen.getByText('Mocked Accounts Info Loader')).toBeInTheDocument();
    });

    it('should render AccountsInfoLoader when is_single_logging_in is true', () => {
        renderComponent(
            mockStore({
                ...default_mock,
                client: {
                    ...default_mock.client,
                    is_single_logging_in: true,
                },
            })
        );

        expect(screen.getByText('Mocked Accounts Info Loader')).toBeInTheDocument();
    });

    it('should render AccountsInfoLoader when is_switching is true', () => {
        renderComponent(
            mockStore({
                ...default_mock,
                client: {
                    ...default_mock.client,
                    is_switching: true,
                },
            })
        );

        expect(screen.getByText('Mocked Accounts Info Loader')).toBeInTheDocument();
    });

    it('should not render HeaderAccountActions when is_from_tradershub_os is true', () => {
        renderComponent(
            mockStore({
                ...default_mock,
                common: {
                    ...default_mock.common,
                    is_from_tradershub_os: true,
                },
            })
        );

        expect(screen.queryByTestId('dt_header_account_actions')).not.toBeInTheDocument();
    });

    it('should call toggleReadyToDepositModal when clicking on deposit and has_any_real_account is false and is_virtual is true', async () => {
        const modified_store = mockStore({
            ...default_mock,
            client: {
                ...default_mock.client,
                has_any_real_account: false,
                is_virtual: true,
            },
        });

        renderComponent(modified_store);

        const header_account_actions = screen.getByTestId('dt_header_account_actions');
        await userEvent.click(header_account_actions);

        expect(modified_store.ui.toggleReadyToDepositModal).toHaveBeenCalled();
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

    it('should add header--tradershub_os_mobile class when is_logged_in, is_from_tradershub_os are true and isDesktop is false', () => {
        (useDevice as jest.Mock).mockImplementationOnce(() => ({ isDesktop: false }));

        renderComponent(
            mockStore({
                ...default_mock,
                common: {
                    ...default_mock.common,
                    is_from_tradershub_os: true,
                },
            })
        );

        const header = screen.getByRole('banner');
        expect(header).toHaveClass('header--tradershub_os_mobile');
    });

    it('should add header--tradershub_os_desktop class when is_logged_in, is_from_tradershub_os and isDesktop are true', () => {
        renderComponent(
            mockStore({
                ...default_mock,
                common: {
                    ...default_mock.common,
                    is_from_tradershub_os: true,
                },
            })
        );

        const header = screen.getByRole('banner');
        expect(header).toHaveClass('header--tradershub_os_desktop');
    });
});
