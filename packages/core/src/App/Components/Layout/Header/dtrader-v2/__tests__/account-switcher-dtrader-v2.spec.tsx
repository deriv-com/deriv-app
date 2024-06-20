import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { mockStore, StoreProvider } from '@deriv/stores';
import AccountSwitcherDTraderV2 from '../account-switcher-dtrader-v2';

const loading = 'Loading';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: jest.fn(() => loading),
}));
jest.mock('App/Components/Routes', () => ({
    ...jest.requireActual('App/Components/Routes'),
    BinaryLink: jest.fn(({ children, onClick }) => <button onClick={onClick}>{children}</button>),
}));

describe('AccountSwitcherDTraderV2', () => {
    let default_mocked_store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        default_mocked_store = {
            ...mockStore({}),
            client: {
                ...mockStore({}).client,
                accounts: {
                    CR90001392: {
                        account_category: 'trading',
                        account_type: 'binary',
                        broker: 'CR',
                        created_at: 1718808311,
                        currency: 'EUR',
                        currency_type: 'fiat',
                        is_disabled: 0,
                        is_virtual: 0,
                        landing_company_shortcode: 'svg',
                        linked_to: [],
                        token: 'a1-hCTEgBnIuYIMaGlSgalvaCsoiYJHA',
                        landing_company_name: 'svg',
                        balance: 0,
                    },
                    MF90000039: {
                        account_category: 'trading',
                        account_type: 'binary',
                        broker: 'MF',
                        created_at: 1718803885,
                        currency: 'USD',
                        currency_type: 'fiat',
                        is_disabled: 0,
                        is_virtual: 0,
                        landing_company_shortcode: 'maltainvest',
                        linked_to: [],
                        token: 'a1-wrXT6jjnZB4CUvS3DHDDKocBbFFwq',
                        landing_company_name: 'maltainvest',
                        balance: 10000,
                    },
                    CR90001397: {
                        account_category: 'trading',
                        account_type: 'binary',
                        broker: 'CR',
                        created_at: 1718810862,
                        currency: 'tUSDT',
                        currency_type: 'crypto',
                        is_disabled: 0,
                        is_virtual: 0,
                        landing_company_shortcode: 'svg',
                        linked_to: [],
                        token: 'mock_token',
                        landing_company_name: 'svg',
                        balance: 0,
                    },
                    CR90001398: {
                        account_category: 'trading',
                        account_type: 'binary',
                        broker: 'CR',
                        created_at: 1718810884,
                        currency: 'BTC',
                        currency_type: 'crypto',
                        is_disabled: 0,
                        is_virtual: 0,
                        landing_company_shortcode: 'svg',
                        linked_to: [],
                        token: 'mock_token',
                        landing_company_name: 'svg',
                        balance: 0,
                    },
                    CR90001399: {
                        account_category: 'trading',
                        account_type: 'binary',
                        broker: 'CR',
                        created_at: 1718810892,
                        currency: 'ETH',
                        currency_type: 'crypto',
                        is_disabled: 0,
                        is_virtual: 0,
                        landing_company_shortcode: 'svg',
                        linked_to: [],
                        token: 'mock_token',
                        landing_company_name: 'svg',
                        balance: 0,
                    },
                    CR90001400: {
                        account_category: 'trading',
                        account_type: 'binary',
                        broker: 'CR',
                        created_at: 1718810905,
                        currency: 'LTC',
                        currency_type: 'crypto',
                        is_disabled: 0,
                        is_virtual: 0,
                        landing_company_shortcode: 'svg',
                        linked_to: [],
                        token: 'mock_token',
                        landing_company_name: 'svg',
                        balance: 0,
                    },
                    CR90001401: {
                        account_category: 'trading',
                        account_type: 'binary',
                        broker: 'CR',
                        created_at: 1718811326,
                        currency: 'eUSDT',
                        currency_type: 'crypto',
                        is_disabled: 0,
                        is_virtual: 0,
                        landing_company_shortcode: 'svg',
                        linked_to: [],
                        token: 'mock_token',
                        landing_company_name: 'svg',
                        balance: 0,
                    },
                    CR90001402: {
                        account_category: 'trading',
                        account_type: 'binary',
                        broker: 'CR',
                        created_at: 1718812190,
                        currency: 'USDC',
                        currency_type: 'crypto',
                        is_disabled: 0,
                        is_virtual: 0,
                        landing_company_shortcode: 'svg',
                        linked_to: [],
                        token: 'mock_token',
                        landing_company_name: 'svg',
                        balance: 0,
                    },
                    VRTC90000880: {
                        account_category: 'trading',
                        account_type: 'binary',
                        broker: 'VRTC',
                        created_at: 1718803885,
                        currency: 'USD',
                        currency_type: 'fiat',
                        is_disabled: 0,
                        is_virtual: 1,
                        linked_to: [],
                        landing_company_shortcode: 'svg',
                        token: 'mock_token',
                        landing_company_name: 'virtual',
                        balance: 1000,
                    },
                },
                account_list: [
                    {
                        loginid: 'CR90001392',
                        is_disabled: 0,
                        is_virtual: 0,
                        icon: 'eur',
                        title: 'EUR',
                    },
                    {
                        loginid: 'MF90000039',
                        is_disabled: 0,
                        is_virtual: 0,
                        icon: 'usd',
                        title: 'USD',
                    },
                    {
                        loginid: 'CR90001397',
                        is_disabled: 0,
                        is_virtual: 0,
                        icon: 'tusdt',
                        title: 'tUSDT',
                    },
                    {
                        loginid: 'CR90001398',
                        is_disabled: 0,
                        is_virtual: 0,
                        icon: 'btc',
                        title: 'BTC',
                    },
                    {
                        loginid: 'CR90001399',
                        is_disabled: 0,
                        is_virtual: 0,
                        icon: 'eth',
                        title: 'ETH',
                    },
                    {
                        loginid: 'CR90001400',
                        is_disabled: 0,
                        is_virtual: 0,
                        icon: 'ltc',
                        title: 'LTC',
                    },
                    {
                        loginid: 'CR90001401',
                        is_disabled: 0,
                        is_virtual: 0,
                        icon: 'eusdt',
                        title: 'eUSDT',
                    },
                    {
                        loginid: 'CR90001402',
                        is_disabled: 0,
                        is_virtual: 0,
                        icon: 'usdc',
                        title: 'USDC',
                    },
                    {
                        loginid: 'VRTC90000880',
                        is_disabled: 0,
                        is_virtual: 1,
                        icon: 'real',
                        title: 'Real',
                    },
                ],
                is_logged_in: true,
                is_landing_company_loaded: true,
                is_eu: false,
                is_low_risk: true,
                is_high_risk: false,
                is_virtual: false,
                is_mt5_allowed: true,
                has_active_real_account: true,
                has_any_real_account: true,
                has_maltainvest_account: true,
                loginid: 'VRTC90000880',
            },
        };
    });

    const mockAccountSwitcherDTraderV2 = () => (
        <StoreProvider store={default_mocked_store}>
            <Router history={createMemoryHistory()}>
                <AccountSwitcherDTraderV2 />
            </Router>
        </StoreProvider>
    );

    it('should not render component is is_logged_in === false', () => {
        default_mocked_store.client.is_logged_in = false;
        const { container } = render(mockAccountSwitcherDTraderV2());

        expect(container).toBeEmptyDOMElement();
    });

    it('should render Loader if is_logging_in === true', () => {
        default_mocked_store.client.is_logging_in = true;
        render(mockAccountSwitcherDTraderV2());

        expect(screen.getByText(loading)).toBeInTheDocument();
    });

    it('should render Loader if is_landing_company_loaded === false', () => {
        default_mocked_store.client.is_landing_company_loaded = false;
        render(mockAccountSwitcherDTraderV2());

        expect(screen.getByText(loading)).toBeInTheDocument();
    });

    it('should render component with children', () => {
        render(mockAccountSwitcherDTraderV2());

        expect(screen.queryByText(loading)).not.toBeInTheDocument();
        expect(screen.getByText('Non-EU Deriv accounts')).toBeInTheDocument();
        expect(screen.getByText('EU Deriv account')).toBeInTheDocument();
        expect(screen.getByText(/Demo account/i)).toBeInTheDocument();
        expect(screen.getByText(/Looking for CFD accounts?/i)).toBeInTheDocument();
        expect(screen.getByText(/Manage accounts/i)).toBeInTheDocument();
    });

    it('should call setTogglePlatformType if user clicks on CFD button', () => {
        render(mockAccountSwitcherDTraderV2());

        expect(default_mocked_store.traders_hub.setTogglePlatformType).not.toBeCalled();
        userEvent.click(screen.getByText(/Looking for CFD accounts?/i));
        expect(default_mocked_store.traders_hub.setTogglePlatformType).toBeCalled();
    });

    it('should call resetVirtualBalance if user clicks on Reset balance button', () => {
        default_mocked_store.client.is_virtual = true;
        render(mockAccountSwitcherDTraderV2());

        expect(default_mocked_store.client.resetVirtualBalance).not.toBeCalled();
        userEvent.click(screen.getByText('Reset balance'));
        expect(default_mocked_store.client.resetVirtualBalance).toBeCalled();
    });

    it('should call switchAccount if user clicks on another (not current) account', async () => {
        render(mockAccountSwitcherDTraderV2());

        expect(default_mocked_store.client.switchAccount).not.toBeCalled();
        userEvent.click(screen.getByText('CR90001392'));
        await waitFor(() => {
            expect(default_mocked_store.client.switchAccount).toBeCalled();
        });
    });

    it('should not call switchAccount if user clicks on current account', async () => {
        render(mockAccountSwitcherDTraderV2());

        expect(default_mocked_store.client.switchAccount).not.toBeCalled();
        userEvent.click(screen.getByText('VRTC90000880'));
        await waitFor(() => {
            expect(default_mocked_store.client.switchAccount).not.toBeCalled();
        });
    });

    it('should call toggleSetCurrencyModal if user clicks on "manage Accounts" btn', async () => {
        render(mockAccountSwitcherDTraderV2());

        expect(default_mocked_store.ui.toggleSetCurrencyModal).not.toBeCalled();
        userEvent.click(screen.getByText(/Manage accounts/i));
        await waitFor(() => {
            expect(default_mocked_store.ui.toggleSetCurrencyModal).toBeCalled();
        });
    });
});
