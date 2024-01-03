import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Analytics } from '@deriv/analytics';
import { StoreProvider, mockStore } from '@deriv/stores';
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

describe('MigrationBanner', () => {
    let response: ReturnType<typeof useMT5SVGEligibleToMigrate>;

    const renderComponent = () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
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

    it('should render MigrationBanner with both MT5 Derived SVG and MT5 Financial SVG text', () => {
        response.eligible_svg_to_bvi_derived_accounts = true;
        response.eligible_svg_to_bvi_financial_accounts = true;
        renderComponent();
        const texts = [/We’re upgrading your/i, /MT5 Derived SVG/i, /MT5 Financial SVG/i, /and/i, /accounts./i];
        texts.forEach(text => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
        expect(screen.getByRole('button', { name: /upgrade now/i })).toBeInTheDocument();
        expect(screen.getByTestId('dt_migrate_desktop')).toBeInTheDocument();
    });

    it('should render MigrationBanner with MT5 Derived SVG', () => {
        response.eligible_svg_to_vanuatu_derived_accounts = true;
        renderComponent();
        const texts = [/We’re upgrading your/i, /MT5 Derived SVG/i, /account./i];
        texts.forEach(text => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
        expect(screen.getByRole('button', { name: /upgrade now/i })).toBeInTheDocument();
        expect(screen.getByTestId('dt_migrate_desktop')).toBeInTheDocument();
    });

    it('should render MigrationBanner with MT5 Financial SVG', () => {
        response.eligible_svg_to_vanuatu_financial_accounts = true;
        renderComponent();
        const texts = [/We’re upgrading your/i, /MT5 Financial SVG/i, /account./i];
        texts.forEach(text => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
        expect(screen.getByRole('button', { name: /upgrade now/i })).toBeInTheDocument();
        expect(screen.getByTestId('dt_migrate_desktop')).toBeInTheDocument();
    });

    it('should call upgrade button tracking event on clicking upgrade now button ', () => {
        renderComponent();
        expect(screen.getByTestId('dt_migrate_desktop')).toBeInTheDocument();
        const upgrade_now_button = screen.getByRole('button', { name: /upgrade now/i });
        expect(upgrade_now_button).toBeInTheDocument();
        userEvent.click(upgrade_now_button);
        expect(Analytics.trackEvent).toHaveBeenCalledWith('ce_upgrade_mt5_banner', {
            action: 'push_cta_upgrade',
        });
    });

    it('should render MigrationBanner with migration mobile image', () => {
        mock_store.ui.is_mobile = true;
        renderComponent();
        expect(screen.getByTestId('dt_migrate_mobile')).toBeInTheDocument();
    });
});
