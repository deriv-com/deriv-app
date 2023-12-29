import React from 'react';
import MT5MigrationFrontSideContent from '../mt5-migration-front-side-content';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import { useMT5MigrationModalContext } from '../mt5-migration-modal-context';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useMT5SVGEligibleToMigrate: jest.fn(),
}));

jest.mock('../mt5-migration-modal-context', () => ({
    ...jest.requireActual('../mt5-migration-modal-context'),
    useMT5MigrationModalContext: jest.fn(),
}));

const mock_store = mockStore({
    ui: {
        is_mobile: false,
    },
});

const mockUseMT5SVGEligibleToMigrate = useMT5SVGEligibleToMigrate as jest.MockedFunction<
    typeof useMT5SVGEligibleToMigrate
>;

const mockUseMT5MigrationModalContext = useMT5MigrationModalContext as jest.MockedFunction<
    typeof useMT5MigrationModalContext
>;

describe('MT5MigrationFrontSideContent', () => {
    let migration_response: ReturnType<typeof useMT5SVGEligibleToMigrate>,
        context_response: ReturnType<typeof useMT5MigrationModalContext>;

    const renderComponent = () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>{children}</StoreProvider>
        );
        mockUseMT5SVGEligibleToMigrate.mockReturnValue(migration_response);
        mockUseMT5MigrationModalContext.mockReturnValue(context_response);
        render(<MT5MigrationFrontSideContent />, { wrapper });
    };

    beforeEach(() => {
        migration_response = {
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
        context_response = {
            show_modal_front_side: false,
            setShowModalFrontSide: jest.fn(),
        };
    });

    it('should render MT5MigrationFrontSideContent', () => {
        renderComponent();
        const getByTextCaseInsensitive = (text: string) =>
            screen.getByText(content => content.toLowerCase() === text.toLowerCase());
        expect(
            getByTextCaseInsensitive('We are giving you a new MT5 account(s) to enhance your trading experience')
        ).toBeInTheDocument();
        expect(screen.getByText(/Your existing/i)).toBeInTheDocument();
        expect(screen.getByText(/MT5 SVG/i)).toBeInTheDocument();
        expect(screen.getByText(/account\(s\) will remain accessible/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });

    it('should render setShowModalFrontSide after clicking on Next button', () => {
        renderComponent();
        const next_button = screen.getByRole('button', { name: 'Next' });
        expect(next_button).toBeInTheDocument();
        userEvent.click(next_button);
        expect(context_response.setShowModalFrontSide).toBeCalled();
    });

    it('should render svg to bvi derived Icons', () => {
        migration_response.eligible_svg_to_bvi_derived_accounts = true;
        renderComponent();
        expect(screen.getByTestId('dt_migrate_from_svg_derived')).toBeInTheDocument;
        expect(screen.getByTestId('dt_migrate_to_bvi_derived')).toBeInTheDocument;
    });

    it('should render svg to bvi financial Icons', () => {
        migration_response.eligible_svg_to_bvi_financial_accounts = true;
        renderComponent();
        expect(screen.getByTestId('dt_migrate_from_svg_financial')).toBeInTheDocument;
        expect(screen.getByTestId('dt_migrate_to_bvi_financial')).toBeInTheDocument;
    });

    it('should render svg to vanuatu derived Icons', () => {
        migration_response.eligible_svg_to_vanuatu_derived_accounts = true;
        renderComponent();
        expect(screen.getByTestId('dt_migrate_from_svg_derived')).toBeInTheDocument;
        expect(screen.getByTestId('dt_migrate_to_vanuatu_derived')).toBeInTheDocument;
    });

    it('should render svg to vanuatu financial Icons', () => {
        migration_response.eligible_svg_to_vanuatu_financial_accounts = true;
        renderComponent();
        expect(screen.getByTestId('dt_migrate_from_svg_financial')).toBeInTheDocument;
        expect(screen.getByTestId('dt_migrate_to_vanuatu_financial')).toBeInTheDocument;
    });

    it('should render both derived svg to bvi and financial svg to bvi Icons', () => {
        migration_response.eligible_svg_to_bvi_derived_accounts = true;
        migration_response.eligible_svg_to_bvi_financial_accounts = true;
        renderComponent();
        expect(screen.getByTestId('dt_migrate_from_svg_derived')).toBeInTheDocument;
        expect(screen.getByTestId('dt_migrate_to_bvi_derived')).toBeInTheDocument;
        expect(screen.getByTestId('dt_migrate_from_svg_financial')).toBeInTheDocument;
        expect(screen.getByTestId('dt_migrate_to_bvi_financial')).toBeInTheDocument;
    });

    it('should render both derived svg to vanuatu and financial svg to vanuatu Icons', () => {
        migration_response.eligible_svg_to_vanuatu_derived_accounts = true;
        migration_response.eligible_svg_to_vanuatu_financial_accounts = true;
        renderComponent();
        expect(screen.getByTestId('dt_migrate_from_svg_derived')).toBeInTheDocument;
        expect(screen.getByTestId('dt_migrate_to_vanuatu_derived')).toBeInTheDocument;
        expect(screen.getByTestId('dt_migrate_from_svg_financial')).toBeInTheDocument;
        expect(screen.getByTestId('dt_migrate_to_vanuatu_financial')).toBeInTheDocument;
    });
});
