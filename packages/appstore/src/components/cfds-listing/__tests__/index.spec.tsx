import React from 'react';

import { useGrowthbookGetFeatureValue, useMT5SVGEligibleToMigrate, useTradingPlatformStatus } from '@deriv/hooks';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';

import CFDsListing from '../index';

jest.mock('Components/containers/listing-container', () =>
    jest.fn(({ children }) => <div data-testid='listing-container'>{children}</div>)
);
jest.mock('@deriv-com/ui', () => ({
    useDevice: jest.fn(() => ({
        isDesktop: true,
        isMobile: false,
        isTablet: false,
    })),
}));
jest.mock('@deriv/hooks');
const mockUseGrowthbookGetFeatureValue = useGrowthbookGetFeatureValue as jest.MockedFunction<
    typeof useGrowthbookGetFeatureValue
>;
const mockUseTradingPlatformStatus = useTradingPlatformStatus as jest.MockedFunction<typeof useTradingPlatformStatus>;
const mockUseMT5SVGEligibleToMigrate = useMT5SVGEligibleToMigrate as jest.MockedFunction<
    typeof useMT5SVGEligibleToMigrate
>;

mockUseGrowthbookGetFeatureValue.mockReturnValue([true, true]);

mockUseMT5SVGEligibleToMigrate.mockReturnValue({
    eligible_account_to_migrate_label: 'BVI',
    eligible_svg_to_bvi_derived_accounts: true,
    eligible_svg_to_bvi_financial_accounts: false,
    eligible_svg_to_vanuatu_derived_accounts: false,
    eligible_svg_to_vanuatu_financial_accounts: false,
    getEligibleAccountToMigrate: jest.fn().mockReturnValue('BVI'),
    has_derived_and_financial_mt5: false,
    has_derived_mt5_to_migrate: true,
    has_svg_accounts_to_migrate: true,
    no_of_svg_accounts_to_migrate: 1,
    svg_accounts_to_migrate: [
        {
            landing_company_short: 'svg',
            eligible_to_migrate: { synthetic: 'BVI' },
        },
    ],
});

mockUseTradingPlatformStatus.mockReturnValue({
    data: [
        {
            platform: 'mt5',
            status: 'active',
        },
    ],
    getPlatformStatus: jest.fn(),
});
describe('CFDsListing', () => {
    it('should not render the component when cfd accounts are not supported', () => {
        const mock = mockStore({
            traders_hub: {
                selected_region: 'Non-EU',
                has_any_real_account: true,
                is_real: true,
                no_MF_account: true,
                is_demo_low_risk: true,
                available_dxtrade_accounts: [],
                available_ctrader_accounts: [],
                combined_cfd_mt5_accounts: [],
            },
            client: {
                is_landing_company_loaded: true,
                is_trading_platform_available_account_loaded: true,
                real_account_creation_unlock_date: '2022-02-02',
            },
            modules: {
                cfd: {
                    toggleCompareAccountsModal: jest.fn(),
                    setAccountType: jest.fn(),
                    current_list: {},
                },
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<CFDsListing />, { wrapper });
        expect(screen.queryByTestId('listing-container')).not.toBeInTheDocument();
    });

    it('should render the component when cfd accounts are  supported', () => {
        const mock = mockStore({
            traders_hub: {
                selected_region: 'Non-EU',
                has_any_real_account: true,
                is_real: true,
                no_MF_account: true,
                is_demo_low_risk: true,
                available_dxtrade_accounts: [],
                available_ctrader_accounts: [],
                combined_cfd_mt5_accounts: [
                    {
                        landing_company_short: 'svg',
                        product: 'financial',
                        status: 'proof_failed',
                        login: '123',
                    },
                ],
            },
            client: {
                is_landing_company_loaded: true,
                is_trading_platform_available_account_loaded: true,
                real_account_creation_unlock_date: '2022-02-02',
            },
            modules: {
                cfd: {
                    toggleCompareAccountsModal: jest.fn(),
                    setAccountType: jest.fn(),
                    current_list: {},
                },
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<CFDsListing />, { wrapper });
        expect(screen.queryByTestId('listing-container')).toBeInTheDocument();
    });
});
