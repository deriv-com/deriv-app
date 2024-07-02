import React from 'react';
import MT5MigrationAccountIcons from '../mt5-migration-account-icons';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useMT5SVGEligibleToMigrate: jest.fn(),
}));

const mock_store = mockStore({});

const mockUseMT5SVGEligibleToMigrate = useMT5SVGEligibleToMigrate as jest.MockedFunction<
    typeof useMT5SVGEligibleToMigrate
>;

describe('MT5MigrationAccountIcons', () => {
    let response: ReturnType<typeof useMT5SVGEligibleToMigrate>;

    const renderComponent = () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>{children}</StoreProvider>
        );
        mockUseMT5SVGEligibleToMigrate.mockReturnValue(response);
        render(<MT5MigrationAccountIcons />, { wrapper });
    };

    beforeEach(() => {
        response = {
            eligible_account_to_migrate_label: 'bvi',
            eligible_svg_to_bvi_derived_accounts: false,
            eligible_svg_to_bvi_financial_accounts: false,
            eligible_svg_to_vanuatu_derived_accounts: false,
            eligible_svg_to_vanuatu_financial_accounts: false,
            getEligibleAccountToMigrate: jest.fn(),
            has_derived_and_financial_mt5: false,
            has_derived_mt5_to_migrate: false,
            has_svg_accounts_to_migrate: false,
            no_of_svg_accounts_to_migrate: 0,
            svg_accounts_to_migrate: [],
        };
    });

    it('should render MT5MigrationAccountIcons for standard bvi account', () => {
        response.eligible_svg_to_bvi_derived_accounts = true;
        renderComponent();
        expect(screen.getByTestId('dt_migrate_from_svg_standard')).toBeInTheDocument();
        expect(screen.getByTestId('dt_migrate_to_bvi_standard')).toBeInTheDocument();
    });

    it('should render MT5MigrationAccountIcons for financial bvi account', () => {
        response.eligible_svg_to_bvi_financial_accounts = true;
        renderComponent();
        expect(screen.getByTestId('dt_migrate_from_svg_financial')).toBeInTheDocument();
        expect(screen.getByTestId('dt_migrate_to_bvi_financial')).toBeInTheDocument();
    });

    it('should render MT5MigrationAccountIcons for standard vanuatu account', () => {
        response.eligible_svg_to_vanuatu_derived_accounts = true;
        renderComponent();
        expect(screen.getByTestId('dt_migrate_from_svg_standard')).toBeInTheDocument();
        expect(screen.getByTestId('dt_migrate_to_vanuatu_standard')).toBeInTheDocument();
    });

    it('should render MT5MigrationAccountIcons for financial vanuatu account', () => {
        response.eligible_svg_to_vanuatu_financial_accounts = true;
        renderComponent();
        expect(screen.getByTestId('dt_migrate_from_svg_financial')).toBeInTheDocument();
        expect(screen.getByTestId('dt_migrate_to_vanuatu_financial')).toBeInTheDocument();
    });

    it('should render MT5MigrationAccountIcons for svg to bvi standard account and svg to bvi financial account', () => {
        response.eligible_svg_to_bvi_derived_accounts = true;
        response.eligible_svg_to_bvi_financial_accounts = true;
        renderComponent();
        expect(screen.getByTestId('dt_migrate_from_svg_standard')).toBeInTheDocument();
        expect(screen.getByTestId('dt_migrate_to_bvi_standard')).toBeInTheDocument();
        expect(screen.getByTestId('dt_migrate_from_svg_financial')).toBeInTheDocument();
        expect(screen.getByTestId('dt_migrate_to_bvi_financial')).toBeInTheDocument();
    });
});
