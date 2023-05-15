import React from 'react';
import AssetSummary from '../asset-summary';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { isMobile } from '@deriv/shared';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

jest.mock('Components/pre-loader/total-assets-loader', () => ({
    __esModule: true,
    default: () => <div>TotalAssetLoader</div>,
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Popover: jest.fn(props => (
        <>
            <span>{props.message}</span>
            <span>{props.alignment}</span>
        </>
    )),
}));

describe('AssetSummary', () => {
    it('should render asset summary', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<AssetSummary />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should render asset summary with total asset', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<AssetSummary />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('Total asset')).toBeInTheDocument();
    });

    it('should not render the total asset text if isMobile is true', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        isMobile.mockImplementation(() => true);
        const { container } = render(<AssetSummary />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.queryByText('Total asset')).not.toBeInTheDocument();
    });

    it('should render the TotalAssetsLoader component if is_switching is true and user has eu_account ', () => {
        const mock = mockStore({
            traders_hub: {
                selected_account_type: 'real',
                is_eu_user: true,
            },
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
        expect(screen.getByText('TotalAssetLoader')).toBeInTheDocument();
    });

    it('should render the TotalAssetsLoader component if is_switching is true and user has cr_account ', () => {
        const mock = mockStore({
            traders_hub: {
                selected_account_type: 'real',
            },
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
        expect(screen.getByText('TotalAssetLoader')).toBeInTheDocument();
    });

    it('should show TotalAsset component if user is in demo account ', () => {
        const mock = mockStore({
            traders_hub: {
                selected_account_type: 'demo',
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

    it('should show alignment of popover as top if isMobile is true', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        isMobile.mockImplementation(() => true);
        const { container } = render(<AssetSummary />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('Total assets in all your accounts')).toBeInTheDocument();
        expect(screen.getByText('top')).toBeInTheDocument();
    });
});
