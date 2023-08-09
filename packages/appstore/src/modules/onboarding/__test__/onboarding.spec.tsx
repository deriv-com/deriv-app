import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import Onboarding from '../onboarding';
import { getTradingHubContents } from 'Constants/trading-hub-content';
import { Router } from 'react-router';
import { routes } from '@deriv/shared';

describe('Onboarding Component Test Coverage', () => {
    it('should render <Onboarding /> component', () => {
        const mock = mockStore({
            client: {
                is_logged_in: true,
                is_language_loaded: true,
                is_landing_company_loaded: true,
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { container } = render(<Onboarding contents={getTradingHubContents()} />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should render text <Onboarding /> component accordingly', () => {
        const mock = mockStore({
            client: {
                is_logged_in: true,
                is_language_loaded: true,
                is_landing_company_loaded: true,
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { container } = render(<Onboarding contents={getTradingHubContents()} />, {
            wrapper,
        });

        const multiplier_title = 'Options & Multipliers';

        expect(container).toBeInTheDocument();
        expect(screen.getByText(multiplier_title)).toBeInTheDocument();
    });

    it('should render Trading Platform cards on <Onboarding /> component accordingly (Non-EU)', () => {
        const mock = mockStore({
            traders_hub: {
                content_flag: 'cr_demo',
            },
            client: {
                is_logged_in: true,
                is_language_loaded: true,
                is_landing_company_loaded: true,
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { container } = render(<Onboarding contents={getTradingHubContents()} />, {
            wrapper,
        });

        const default_trading_platform_title = 'Deriv account';
        const default_trading_platform_description = 'Get a real Deriv account, start trading and manage your funds.';

        const dtrader_title = 'Deriv Trader';
        const dtrader_description = 'Options and multipliers trading platform.';

        const dbot_title = 'Deriv Bot';
        const dbot_description = 'Automate your trading, no coding needed.';

        const mt5_title = 'Deriv MT5';
        const mt5_description = 'Trade CFDs on MT5 with synthetics, baskets, and derived FX.';

        expect(container).toBeInTheDocument();
        expect(screen.getByText(default_trading_platform_title)).toBeInTheDocument();
        expect(screen.getByText(default_trading_platform_description)).toBeInTheDocument();
        expect(screen.getByText(dtrader_title)).toBeInTheDocument();
        expect(screen.getByText(dtrader_description)).toBeInTheDocument();
        expect(screen.getByText(dbot_title)).toBeInTheDocument();
        expect(screen.getByText(dbot_description)).toBeInTheDocument();
        expect(screen.getByText(mt5_title)).toBeInTheDocument();
        expect(screen.getByText(mt5_description)).toBeInTheDocument();
    });

    it('should render Trading Platform cards on <Onboarding /> component accordingly (EU)', () => {
        const mock = mockStore({
            traders_hub: {
                content_flag: 'eu_demo',
            },
            client: {
                is_eu_country: true,
                is_logged_in: true,
                is_language_loaded: true,
                is_landing_company_loaded: true,
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { container } = render(<Onboarding contents={getTradingHubContents()} />, {
            wrapper,
        });

        const default_trading_platform_title = 'Multipliers account';
        const default_trading_platform_description = 'Get a real Deriv account, start trading and manage your funds.';

        const dtrader_title = 'Deriv Trader';
        const dtrader_description = 'Options and multipliers trading platform.';

        const cfd_description =
            'Trade CFDs on MT5 with forex, stocks, stock indices, synthetics, cryptocurrencies, and commodities.';

        expect(container).toBeInTheDocument();
        expect(screen.getByText(default_trading_platform_title)).toBeInTheDocument();
        expect(screen.getByText(default_trading_platform_description)).toBeInTheDocument();
        expect(screen.getByText(dtrader_title)).toBeInTheDocument();
        expect(screen.getByText(dtrader_description)).toBeInTheDocument();
        expect(screen.getByText(cfd_description)).toBeInTheDocument();
    });

    it('should render Footer on <Onboarding /> component accordingly', async () => {
        const mock = mockStore({
            client: {
                is_logged_in: true,
                is_language_loaded: true,
                is_landing_company_loaded: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<Onboarding contents={getTradingHubContents()} />, {
            wrapper,
        });

        const footer_title = "Welcome to Trader's Hub";
        const footer_description = 'This is your personal start page for Deriv';

        const updated_title = 'Trading accounts';
        const updated_description =
            'These are the trading accounts available to you. You can click on an account’s icon or description to find out more';

        const next_btn = screen.getByRole('button', { name: /Next/i });

        expect(container).toBeInTheDocument();
        expect(screen.getByText(footer_title)).toBeInTheDocument();
        expect(screen.getByText(footer_description)).toBeInTheDocument();
        expect(next_btn).toBeInTheDocument();
        userEvent.click(next_btn);
        expect(await screen.findByText(updated_title)).toBeInTheDocument();
        expect(await screen.findByText(updated_description)).toBeInTheDocument();
        await waitFor(() => {
            const prev_btn = screen.queryByRole('button', { name: /Back/i });
            expect(prev_btn).toBeInTheDocument();
        });
    });

    it('should render and exit onboarding when clicking on the close icon', () => {
        const mock = mockStore({
            client: {
                is_logged_in: true,
                is_language_loaded: true,
                is_landing_company_loaded: true,
            },
        });
        const history = createBrowserHistory();
        const { container } = render(
            <Router history={history}>
                <StoreProvider store={mock}>
                    <Onboarding contents={getTradingHubContents()} />
                </StoreProvider>
            </Router>
        );

        const close_btn = screen.getByTestId('dt-onboarding-close-button');

        expect(container).toBeInTheDocument();
        expect(close_btn).toBeInTheDocument();
        userEvent.click(close_btn);
        expect(history.location.pathname).toBe(routes.traders_hub);
    });

    it('should render <EmptyOnboarding/> component instead', () => {
        const mock = mockStore({});
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<Onboarding contents={getTradingHubContents()} />, {
            wrapper,
        });
        expect(screen.getByTestId('dt_empty_onboarding')).toBeInTheDocument();
    });
});
