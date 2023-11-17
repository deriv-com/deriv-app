import React from 'react';
import MT5MigrationBackSideContent from '../mt5-migration-back-side-content';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { CFDStoreProvider } from 'Stores/Modules/CFD/Helpers/useCfdStores';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import userEvent from '@testing-library/user-event';
import { useMT5MigrationModalContext } from '../mt5-migration-modal-context';

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
        toggleMT5MigrationModal: jest.fn(),
        setMT5MigrationModalEnabled: jest.fn(),
    },
    common: {
        setAppstorePlatform: jest.fn(),
    },
});

const mockUseMT5MigrationModalContext = useMT5MigrationModalContext as jest.MockedFunction<
    typeof useMT5MigrationModalContext
>;

const mockUseMT5SVGEligibleToMigrate = useMT5SVGEligibleToMigrate as jest.MockedFunction<
    typeof useMT5SVGEligibleToMigrate
>;

describe('MT5MigrationBackSideContent', () => {
    let response: ReturnType<typeof useMT5SVGEligibleToMigrate>,
        response_migration_context: ReturnType<typeof useMT5MigrationModalContext>;
    const renderComponent = () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <CFDStoreProvider>{children}</CFDStoreProvider>
            </StoreProvider>
        );
        mockUseMT5SVGEligibleToMigrate.mockReturnValue(response);
        mockUseMT5MigrationModalContext.mockReturnValue(response_migration_context);
        render(<MT5MigrationBackSideContent />, { wrapper });
    };

    beforeEach(() => {
        response = {
            eligible_account_to_migrate_label: 'bvi',
            getEligibleAccountToMigrate: jest.fn().mockReturnValue('bvi'),
            eligible_svg_to_bvi_derived_accounts: false,
            eligible_svg_to_bvi_financial_accounts: false,
            eligible_svg_to_vanuatu_derived_accounts: false,
            eligible_svg_to_vanuatu_financial_accounts: false,
            has_derived_and_financial_mt5: false,
            has_derived_mt5_to_migrate: false,
            has_svg_accounts_to_migrate: false,
            no_of_svg_accounts_to_migrate: 0,
            svg_accounts_to_migrate: [],
        };
        response_migration_context = {
            show_modal_front_side: true,
            setShowModalFrontSide: jest.fn(),
        };
    });

    it('should render MT5MigrationBackSideContent for BVI migration account', () => {
        renderComponent();
        expect(screen.getByText(/what will happen to the funds in my existing account\(s\)\?/i)).toBeInTheDocument();
        expect(screen.getByText(/if you have open positions/i)).toBeInTheDocument();
        expect(screen.getAllByText(/your funds will remain in your existing mt5 account\(s\)\./i)).toHaveLength(2);
        expect(
            screen.getByText(
                /you can continue to hold your current open positions in your existing mt5 account\(s\)\./i
            )
        ).toBeInTheDocument();
        expect(
            screen.getAllByText(/new mt5 account\(s\) under the bvi jurisdiction will be created for new trades\./i)
        ).toHaveLength(2);
        expect(screen.getByText(/if you don’t have open positions/i)).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
        expect(
            screen.getByText(/i agree to move my mt5 account\(s\) and agree to deriv bvi ltd’s/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/terms and conditions/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });

    it('should render MT5MigrationBackSideContent for Vanuatu migration account', () => {
        response.eligible_account_to_migrate_label = 'vanuatu';
        renderComponent();
        expect(
            screen.getAllByText(/new mt5 account\(s\) under the vanuatu jurisdiction will be created for new trades\./i)
        ).toHaveLength(2);
        expect(
            screen.getByText(/i agree to move my mt5 account\(s\) and agree to deriv vanuatu ltd’s/i)
        ).toBeInTheDocument();
    });

    it('should render MT5Context Function after clicking on Back button', () => {
        renderComponent();
        const back_button = screen.getByRole('button', { name: 'Back' });
        userEvent.click(back_button);
        expect(response_migration_context.setShowModalFrontSide).toBeCalled();
    });

    it('should enable Next Button after clicking on checkbox', () => {
        renderComponent();
        const checkbox = screen.getByRole('checkbox');
        userEvent.click(checkbox);
        const next_button = screen.getByRole('button', { name: 'Next' });
        expect(next_button).toBeEnabled();
    });

    it('should trigger functions after clicking on Next button', () => {
        renderComponent();
        const checkbox = screen.getByRole('checkbox');
        userEvent.click(checkbox);
        const next_button = screen.getByRole('button', { name: 'Next' });
        userEvent.click(next_button);
        expect(mock_store.common.setAppstorePlatform).toBeCalled();
        expect(mock_store.modules.cfd.setJurisdictionSelectedShortcode).toBeCalled();
        expect(mock_store.ui.setMT5MigrationModalEnabled).toBeCalled();
        expect(mock_store.ui.toggleMT5MigrationModal).toBeCalled();
        expect(mock_store.modules.cfd.enableCFDPasswordModal).toBeCalled();
    });
});
