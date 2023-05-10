import React from 'react';
import AssetSummary from '../asset-summary';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { isMobile } from '@deriv/shared';

jest.mock('../../pre-loader/total-assets-loader', () => ({
    __esModule: true,
    default: () => <div>TotalAssetsLoader</div>,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    usePlatformAccounts: jest.fn(() => ({
        real: [
            {
                balance: 100,
                currency: 'USD',
            },
        ],
        demo: {
            balance: 10000,
            currency: 'USD',
        },
    })),
    useCfdAccounts: jest.fn(() => ({
        real: [
            {
                balance: 15000,
                currency: 'USD',
            },
        ],
        demo: {
            balance: 123213,
            currency: 'USD',
        },
    })),
}));

describe('AssetSummary', () => {
    it('should render correctly', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<AssetSummary />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should render the text and balance correctly', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<AssetSummary />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('Total asset')).toBeInTheDocument();
        expect(screen.getByText('15,100.00')).toBeInTheDocument();
    });

    it('should not show Total Assets title if isMobile is true ', () => {
        isMobile.mockReturnValue(true);
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<AssetSummary />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.queryByText('Total assets')).not.toBeInTheDocument();
    });

    it('should show loader if is_switching is true ', () => {
        const mock = mockStore({
            client: {
                is_switching: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<AssetSummary />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('TotalAssetsLoader')).toBeInTheDocument();
    });

    it('should not render if user has no real account ', () => {
        const mock = mockStore({
            client: {
                has_maltainvest_account: false,
            },
            traders_hub: {
                selected_account_type: 'real',
                is_eu_user: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<AssetSummary />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should show the correct amount in real tab', () => {
        const mock = mockStore({
            traders_hub: {
                selected_account_type: 'real',
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<AssetSummary />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('15,100.00')).toBeInTheDocument();
    });

    it('should not show component if user has no real MF account and in eu regulation', () => {
        const mock = mockStore({
            traders_hub: {
                selected_account_type: 'real',
                is_eu_user: true,
                no_MF_account: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<AssetSummary />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.queryByText('Total assets')).not.toBeInTheDocument();
    });

    it('should not show component if user has no real CR account and in non-eu regulation', () => {
        const mock = mockStore({
            traders_hub: {
                selected_account_type: 'real',
                no_CR_account: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<AssetSummary />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.queryByText('Total assets')).not.toBeInTheDocument();
    });

    it('should show the correct balance for demo account ', () => {
        const mock = mockStore({
            traders_hub: {
                selected_account_type: 'demo',
                platform_demo_balance: {
                    balance: 10000,
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<AssetSummary />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('10,000.00')).toBeInTheDocument();
    });

    it('should show the correct real total amount with total cfd currency', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<AssetSummary />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('15,100.00')).toBeInTheDocument();
    });

    it('should show the correct total demo amount with total demo cfd currency', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<AssetSummary />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('15,100.00')).toBeInTheDocument();
    });
});
