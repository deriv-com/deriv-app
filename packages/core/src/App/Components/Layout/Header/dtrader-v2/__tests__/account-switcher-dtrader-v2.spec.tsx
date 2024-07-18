import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { mockStore, StoreProvider } from '@deriv/stores';
import { Jurisdiction, CURRENCY_TYPE } from '@deriv/shared';
import { BROKER_CODE } from '../Utils/account-switcher-dtrader-v2-utils';
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
                        broker: BROKER_CODE.CR,
                        currency: 'EUR',
                        currency_type: CURRENCY_TYPE.FIAT,
                        is_disabled: 0,
                        is_virtual: 0,
                        landing_company_shortcode: Jurisdiction.SVG,
                        token: 'mock_token',
                        landing_company_name: Jurisdiction.SVG,
                        balance: 0,
                    },
                    MF90000039: {
                        broker: BROKER_CODE.MF,
                        currency: 'USD',
                        currency_type: CURRENCY_TYPE.FIAT,
                        is_disabled: 0,
                        is_virtual: 0,
                        landing_company_shortcode: Jurisdiction.MALTA_INVEST,
                        token: 'mock_token',
                        landing_company_name: Jurisdiction.MALTA_INVEST,
                        balance: 10000,
                    },
                    CR90001397: {
                        broker: BROKER_CODE.CR,
                        currency: 'tUSDT',
                        currency_type: CURRENCY_TYPE.CRYPTO,
                        is_disabled: 0,
                        is_virtual: 0,
                        landing_company_shortcode: Jurisdiction.SVG,
                        token: 'mock_token',
                        landing_company_name: Jurisdiction.SVG,
                        balance: 0,
                    },
                    CR90001398: {
                        broker: BROKER_CODE.CR,
                        currency: 'BTC',
                        currency_type: CURRENCY_TYPE.CRYPTO,
                        is_disabled: 0,
                        is_virtual: 0,
                        landing_company_shortcode: Jurisdiction.SVG,
                        token: 'mock_token',
                        landing_company_name: Jurisdiction.SVG,
                        balance: 0,
                    },
                    CR90001399: {
                        broker: BROKER_CODE.CR,
                        currency: 'ETH',
                        currency_type: CURRENCY_TYPE.CRYPTO,
                        is_disabled: 0,
                        is_virtual: 0,
                        landing_company_shortcode: Jurisdiction.SVG,
                        token: 'mock_token',
                        landing_company_name: Jurisdiction.SVG,
                        balance: 0,
                    },
                    CR90001400: {
                        broker: BROKER_CODE.CR,
                        currency: 'LTC',
                        currency_type: CURRENCY_TYPE.CRYPTO,
                        is_disabled: 0,
                        is_virtual: 0,
                        landing_company_shortcode: Jurisdiction.SVG,
                        token: 'mock_token',
                        landing_company_name: Jurisdiction.SVG,
                        balance: 0,
                    },
                    CR90001401: {
                        broker: BROKER_CODE.CR,
                        currency: 'eUSDT',
                        currency_type: CURRENCY_TYPE.CRYPTO,
                        is_disabled: 0,
                        is_virtual: 0,
                        landing_company_shortcode: Jurisdiction.SVG,
                        token: 'mock_token',
                        landing_company_name: Jurisdiction.SVG,
                        balance: 0,
                    },
                    CR90001402: {
                        broker: BROKER_CODE.CR,
                        currency: 'USDC',
                        currency_type: CURRENCY_TYPE.CRYPTO,
                        is_disabled: 0,
                        is_virtual: 0,
                        landing_company_shortcode: Jurisdiction.SVG,
                        token: 'mock_token',
                        landing_company_name: Jurisdiction.SVG,
                        balance: 0,
                    },
                    VRTC90000880: {
                        broker: BROKER_CODE.VRTC,
                        currency: 'USD',
                        currency_type: CURRENCY_TYPE.FIAT,
                        is_disabled: 0,
                        is_virtual: 1,
                        landing_company_shortcode: Jurisdiction.SVG,
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
                        title: 'EUR',
                    },
                    {
                        loginid: 'MF90000039',
                        is_disabled: 0,
                        is_virtual: 0,
                        title: 'USD',
                    },
                    {
                        loginid: 'CR90001397',
                        is_disabled: 0,
                        is_virtual: 0,
                        title: 'tUSDT',
                    },
                    {
                        loginid: 'CR90001398',
                        is_disabled: 0,
                        is_virtual: 0,
                        title: 'BTC',
                    },
                    {
                        loginid: 'CR90001399',
                        is_disabled: 0,
                        is_virtual: 0,
                        title: 'ETH',
                    },
                    {
                        loginid: 'CR90001400',
                        is_disabled: 0,
                        is_virtual: 0,
                        title: 'LTC',
                    },
                    {
                        loginid: 'CR90001401',
                        is_disabled: 0,
                        is_virtual: 0,
                        title: 'eUSDT',
                    },
                    {
                        loginid: 'CR90001402',
                        is_disabled: 0,
                        is_virtual: 0,
                        title: 'USDC',
                    },
                    {
                        loginid: 'VRTC90000880',
                        is_disabled: 0,
                        is_virtual: 1,
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
