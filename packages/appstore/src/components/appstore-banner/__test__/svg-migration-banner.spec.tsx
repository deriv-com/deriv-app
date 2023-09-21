import React from 'react';
import { screen, render } from '@testing-library/react';
import SVGMigrationBanner from '../svg-migration-banner';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import { APIProvider } from '@deriv/api';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useMT5SVGEligibleToMigrate: jest.fn(),
}));

const mock_store = mockStore({});

const mockUseMT5SVGEligibleToMigrate = useMT5SVGEligibleToMigrate as jest.MockedFunction<
    typeof useMT5SVGEligibleToMigrate
>;

type TUseMT5SVGEligibleToMigrateReturnValue = {
    eligible_svg_to_bvi_derived_accounts: boolean;
    eligible_svg_to_bvi_financial_accounts: boolean;
    eligible_svg_to_vanuatu_derived_accounts: boolean;
    eligible_svg_to_vanuatu_financial_accounts: boolean;
};

describe('SVGMigrationBanner', () => {
    let response: TUseMT5SVGEligibleToMigrateReturnValue;

    const renderComponent = () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        );
        mockUseMT5SVGEligibleToMigrate.mockReturnValue(response);
        render(<SVGMigrationBanner />, { wrapper });
    };

    beforeEach(() => {
        response = {
            eligible_svg_to_bvi_derived_accounts: false,
            eligible_svg_to_bvi_financial_accounts: false,
            eligible_svg_to_vanuatu_derived_accounts: false,
            eligible_svg_to_vanuatu_financial_accounts: false,
        };
    });

    it('should not render SVGMigrationBanner', () => {
        renderComponent();
        const texts = [/We’re upgrading your/i, /MT5 Derived SVG/i, /MT5 Financial SVG/i, /and/i, /account./i];
        texts.forEach(text => {
            expect(screen.getByText(text)).not.toBeInTheDocument();
        });
        expect(screen.getByRole('button', { name: /upgrade now/i })).not.toBeInTheDocument();
        expect(screen.getByTestId('dt_svg_migrate_desktop')).not.toBeInTheDocument();
    });

    it('should render SVGMigrationBanner with both MT5 Derived SVG and MT5 Financial SVG text', () => {
        response.eligible_svg_to_bvi_derived_accounts = true;
        response.eligible_svg_to_bvi_financial_accounts = true;
        renderComponent();
        const texts = [/We’re upgrading your/i, /MT5 Derived SVG/i, /MT5 Financial SVG/i, /and/i, /account./i];
        texts.forEach(text => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
        expect(screen.getByRole('button', { name: /upgrade now/i })).toBeInTheDocument();
        expect(screen.getByTestId('dt_svg_migrate_desktop')).toBeInTheDocument();
    });

    it('should render SVGMigrationBanner with MT5 Derived SVG', () => {
        response.eligible_svg_to_vanuatu_derived_accounts = true;
        renderComponent();
        const texts = [/We’re upgrading your/i, /MT5 Derived SVG/i, /account./i];
        texts.forEach(text => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
        expect(screen.getByRole('button', { name: /upgrade now/i })).toBeInTheDocument();
        expect(screen.getByTestId('dt_svg_migrate_desktop')).toBeInTheDocument();
    });

    it('should render SVGMigrationBanner with MT5 Financial SVG', () => {
        response.eligible_svg_to_vanuatu_financial_accounts = true;
        renderComponent();
        const texts = [/We’re upgrading your/i, /MT5 Financial SVG/i, /account./i];
        texts.forEach(text => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
        expect(screen.getByRole('button', { name: /upgrade now/i })).toBeInTheDocument();
        expect(screen.getByTestId('dt_svg_migrate_desktop')).toBeInTheDocument();
    });

    it('should render SVGMigrationBanner with migration mobile image', () => {
        mock_store.ui.is_mobile = true;
        renderComponent();
        expect(screen.getByTestId('dt_svg_migrate_mobile')).toBeInTheDocument();
    });
});
