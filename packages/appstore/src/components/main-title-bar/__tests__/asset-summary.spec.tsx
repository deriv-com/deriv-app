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

let mock = mockStore({});

const checkContainerAssetSummary = () => {
    const wrapper = ({ children }: { children: JSX.Element }) => <StoreProvider store={mock}>{children}</StoreProvider>;

    const { container } = render(<AssetSummary />, {
        wrapper,
    });
    expect(container).toBeInTheDocument();
};

describe('AssetSummary', () => {
    beforeEach(() => {
        mock = mockStore({});
    });
    it('should render asset summary', () => {
        checkContainerAssetSummary();
    });

    it('should render asset summary with total asset', () => {
        checkContainerAssetSummary();
        expect(screen.getByText('Total asset')).toBeInTheDocument();
    });

    it('should not render the total asset text if isMobile is true', () => {
        isMobile.mockImplementation(() => true);
        checkContainerAssetSummary();
        expect(screen.queryByText('Total asset')).not.toBeInTheDocument();
    });

    it('should render the TotalAssetsLoader component if is_switching is true and user has eu_account ', () => {
        mock.traders_hub.selected_account_type = 'real';
        mock.traders_hub.is_eu_user = true;
        mock.client.is_switching = true;

        checkContainerAssetSummary();
        expect(screen.getByText('TotalAssetLoader')).toBeInTheDocument();
    });

    it('should render the TotalAssetsLoader component if is_switching is true and user has cr_account ', () => {
        mock.traders_hub.selected_account_type = 'real';
        mock.client.is_switching = true;

        checkContainerAssetSummary();
        expect(screen.getByText('TotalAssetLoader')).toBeInTheDocument();
    });

    it('should show TotalAsset component if user is in demo account ', () => {
        mock.traders_hub.selected_account_type = 'demo';

        checkContainerAssetSummary();
    });

    it('should show alignment of popover as top if isMobile is true', () => {
        isMobile.mockImplementation(() => true);
        checkContainerAssetSummary();
        expect(screen.getByText('Total assets in all your accounts')).toBeInTheDocument();
        expect(screen.getByText('top')).toBeInTheDocument();
    });
});
