import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore, StoreProvider } from '@deriv/stores';
import Onboarding from '../onboarding';
import { getTradingHubContents } from 'Constants/trading-hub-content';
import EmptyOnboarding from '../empty-onboarding';

describe('Onboarding', () => {
    it('should render <Onboarding /> component', () => {
        const mock = mockStore({
            traders_hub: {
                toggleIsTourOpen: jest.fn(),
                selectAccountType: jest.fn(),
                is_demo_low_risk: false,
                content_flag: '',
            },
            client: {
                is_eu_country: false,
                is_logged_in: true,
                is_language_loaded: true,
                prev_account_type: '',
                setAccountType: jest.fn(),
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
            traders_hub: {
                toggleIsTourOpen: jest.fn(),
                selectAccountType: jest.fn(),
                is_demo_low_risk: false,
                content_flag: '',
            },
            client: {
                is_eu_country: false,
                is_logged_in: true,
                is_language_loaded: true,
                prev_account_type: '',
                setAccountType: jest.fn(),
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
                toggleIsTourOpen: jest.fn(),
                selectAccountType: jest.fn(),
                is_demo_low_risk: false,
                content_flag: 'cr_demo',
            },
            client: {
                is_eu_country: false,
                is_logged_in: true,
                is_language_loaded: true,
                prev_account_type: '',
                setAccountType: jest.fn(),
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
                toggleIsTourOpen: jest.fn(),
                selectAccountType: jest.fn(),
                is_demo_low_risk: false,
                content_flag: 'eu_demo',
            },
            client: {
                is_eu_country: true,
                is_logged_in: true,
                is_language_loaded: true,
                prev_account_type: '',
                setAccountType: jest.fn(),
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

        const dbot_title = 'Deriv Bot';
        const dbot_description = 'Automate your trading, no coding needed.';

        const cfd_description =
            'Trade CFDs on MT5 with forex, stocks, stock indices, synthetics, cryptocurrencies, and commodities.';

        expect(container).toBeInTheDocument();
        expect(screen.getByText(default_trading_platform_title)).toBeInTheDocument();
        expect(screen.getByText(default_trading_platform_description)).toBeInTheDocument();
        expect(screen.getByText(dtrader_title)).toBeInTheDocument();
        expect(screen.getByText(dtrader_description)).toBeInTheDocument();
        expect(screen.getByText(cfd_description)).toBeInTheDocument();
        expect(screen.getByText(dbot_title)).not.toBeInTheDocument();
        expect(screen.getByText(dbot_description)).not.toBeInTheDocument();
    });

    it('should render Footer on <Onboarding /> component accordingly', () => {
        const mock = mockStore({
            traders_hub: {
                toggleIsTourOpen: jest.fn(),
                selectAccountType: jest.fn(),
                is_demo_low_risk: false,
                content_flag: 'cr_demo',
            },
            client: {
                is_eu_country: false,
                is_logged_in: true,
                is_language_loaded: true,
                prev_account_type: '',
                setAccountType: jest.fn(),
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
        const btn = screen.getByRole('button', {
            name: /Next/i,
        });

        expect(container).toBeInTheDocument();
        expect(screen.getByText(footer_title)).toBeInTheDocument();
        expect(screen.getByText(footer_description)).toBeInTheDocument();
        expect(btn).toBeInTheDocument();
    });

    it('should not render <EmptyOnboarding/> component instead', () => {
        const mock = mockStore({
            traders_hub: {
                toggleIsTourOpen: jest.fn(),
                selectAccountType: jest.fn(),
                is_demo_low_risk: false,
                content_flag: '',
            },
            client: {
                is_eu_country: false,
                is_logged_in: false,
                is_language_loaded: true,
                prev_account_type: '',
                setAccountType: jest.fn(),
                is_landing_company_loaded: false,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<EmptyOnboarding />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });
});
