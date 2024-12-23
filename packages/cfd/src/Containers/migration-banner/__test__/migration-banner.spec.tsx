import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Analytics } from '@deriv-com/analytics';
import { StoreProvider, mockStore } from '@deriv/stores';
import { CFDStoreProvider } from '../../../Stores/Modules/CFD/Helpers/useCfdStores';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import { APIProvider } from '@deriv/api';
import MigrationBanner from '../migration-banner';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useMT5SVGEligibleToMigrate: jest.fn(),
}));

const mock_store = mockStore({});

const mockUseMT5SVGEligibleToMigrate = useMT5SVGEligibleToMigrate as jest.MockedFunction<
    typeof useMT5SVGEligibleToMigrate
>;
jest.mock('../migration-banner-image', () => jest.fn(() => <div>MigrationBannerImage</div>));

describe('MigrationBanner', () => {
    let response: ReturnType<typeof useMT5SVGEligibleToMigrate>;

    const renderComponent = () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock_store}>
                    <CFDStoreProvider>{children} </CFDStoreProvider>
                </StoreProvider>
            </APIProvider>
        );
        mockUseMT5SVGEligibleToMigrate.mockReturnValue(response);
        render(<MigrationBanner />, { wrapper });
    };

    beforeEach(() => {
        response = {
            getEligibleAccountToMigrate: jest.fn(),
            svg_accounts_to_migrate: [],
            no_of_svg_accounts_to_migrate: 0,
            has_svg_accounts_to_migrate: false,
            eligible_account_to_migrate_label: false,
            eligible_svg_to_bvi_derived_accounts: false,
            eligible_svg_to_bvi_financial_accounts: false,
            eligible_svg_to_vanuatu_derived_accounts: false,
            eligible_svg_to_vanuatu_financial_accounts: false,
            has_derived_and_financial_mt5: true,
            has_derived_mt5_to_migrate: true,
        };
    });

    it('should render MigrationBanner with both MT5 Standard SVG and MT5 Financial SVG text', () => {
        renderComponent();

        const texts = [/Upgrade your/i, /Standard/i, /Financial MT5/i, /account\(s\)/i];
        texts.forEach(text => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
        expect(screen.getByRole('button', { name: /upgrade/i })).toBeInTheDocument();
    });

    it('should render MigrationBanner with MT5 Standard SVG', () => {
        response.has_derived_and_financial_mt5 = false;
        renderComponent();
        const texts = [/Upgrade your/i, /Standard MT5/i, /account\(s\)/i];
        texts.forEach(text => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
        expect(screen.getByRole('button', { name: /upgrade/i })).toBeInTheDocument();
    });

    it('should render MigrationBanner with MT5 Financial SVG', () => {
        response.has_derived_and_financial_mt5 = false;
        response.has_derived_mt5_to_migrate = false;
        renderComponent();
        const texts = [/Upgrade your/i, /Financial MT5/i, /account\(s\)/i];
        texts.forEach(text => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
    });

    it('should call upgrade button tracking event on clicking upgrade now button ', () => {
        renderComponent();
        const upgrade_button = screen.getByRole('button', { name: /upgrade/i });
        expect(upgrade_button).toBeInTheDocument();
        userEvent.click(upgrade_button);
        expect(Analytics.trackEvent).toHaveBeenCalledWith('ce_upgrade_mt5_banner', {
            action: 'push_cta_upgrade',
        });
    });
});
