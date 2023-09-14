import React from 'react';
import { render, screen } from '@testing-library/react';
import { CFD_PLATFORMS } from '@deriv/shared';
import { StoreProvider, mockStore } from '@deriv/stores';
import CFDCompareAccountsCard from '../cfd-compare-accounts-card';

jest.mock('../../../Assets/svgs/trading-platform', () => jest.fn(() => <div>Mocked Icon</div>));
jest.mock('../instruments-icon-with-label', () => jest.fn(() => <div>Mocked Icon With Label</div>));

describe('<CFDCompareAccountsCard />', () => {
    const mock = mockStore({
        client: {
            trading_platform_available_accounts: {},
        },
        traders_hub: {
            available_cfd_accounts: [],
            is_demo: false,
            is_eu_user: false,
        },
        modules: {
            cfd: {
                current_list: {},
                setAccountType: jest.fn(),
                setJurisdictionSelectedShortcode: jest.fn(),
                enableCFDPasswordModal: jest.fn(),
                toggleCFDVerificationModal: jest.fn(),
            },
        },
    });

    const mocked_props = {
        trading_platforms: {
            market_type: 'gaming',
            shortcode: 'svg',
            platform: 'mt5',
        },
        is_demo: false,
        is_eu_user: false,
    };

    it('should render the component and not render the "New!" banner for MT5', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<CFDCompareAccountsCard {...mocked_props} />, { wrapper });

        const buttonElement = screen.getByRole('button', { name: /Add/i });
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveClass('compare-cfd-account__button');
        expect(buttonElement).toBeEnabled();

        expect(screen.queryByText(/New!/i)).not.toBeInTheDocument();
    });

    it('should render the "Boom 300 and Crash 300 Index" for EU user', () => {
        mocked_props.is_eu_user = true;
        mocked_props.is_demo = false;

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<CFDCompareAccountsCard {...mocked_props} />, { wrapper });

        expect(screen.queryByText(/New!/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Boom 300 and Crash 300 Index/i)).toBeInTheDocument();
    });

    it('should renders the component and not render the "New!" banner for MT5 demo', () => {
        mocked_props.is_eu_user = false;
        mocked_props.is_demo = true;

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<CFDCompareAccountsCard {...mocked_props} />, { wrapper });

        const buttonElement = screen.getByRole('button', { name: /Add/i });
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveClass('compare-cfd-account__button');
        expect(buttonElement).toBeEnabled();

        expect(screen.queryByText(/New!/i)).not.toBeInTheDocument();
    });

    it('should not render the "New!" banner for Deriv X', () => {
        mocked_props.trading_platforms.platform = CFD_PLATFORMS.DXTRADE;

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<CFDCompareAccountsCard {...mocked_props} />, { wrapper });

        expect(screen.queryByText(/New!/i)).not.toBeInTheDocument();
    });

    it('should render the "New!" banner for DerivEz', () => {
        mocked_props.trading_platforms.platform = CFD_PLATFORMS.DERIVEZ;
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<CFDCompareAccountsCard {...mocked_props} />, { wrapper });

        expect(screen.queryByText(/New!/i)).toBeInTheDocument();
    });
});
