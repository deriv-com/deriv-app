import React from 'react';
import MT5MigrationBackSideContent from '../mt5-migration-back-side-content';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { APIProvider } from '@deriv/api';
import { CFDStoreProvider } from 'Stores/Modules/CFD/Helpers/useCfdStores';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useMT5SVGEligibleToMigrate: jest.fn(),
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

const mockUseMT5SVGEligibleToMigrate = useMT5SVGEligibleToMigrate as jest.MockedFunction<
    typeof useMT5SVGEligibleToMigrate
>;

describe('MT5MigrationBackSideContent', () => {
    let response: Partial<ReturnType<typeof useMT5SVGEligibleToMigrate>>;
    const renderComponent = () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock_store}>
                    <CFDStoreProvider>{children}</CFDStoreProvider>
                </StoreProvider>
            </APIProvider>
        );
        // @ts-expect-error response return value is not required to have all object
        mockUseMT5SVGEligibleToMigrate.mockReturnValue(response);
        render(<MT5MigrationBackSideContent />, { wrapper });
    };

    beforeEach(() => {
        response = {
            eligible_account_to_migrate_label: 'bvi',
            getEligibleAccountToMigrate: () => 'bvi',
        };
    });

    it('should render MT5MigrationBackSideContent for BVI migration account', () => {
        renderComponent();
        expect(screen.getByText(/what will happen to the funds in my existing account\(s\)\?/i)).toBeInTheDocument();
        expect(screen.getByText(/if you have open positions/i)).toBeInTheDocument();
        expect(screen.getAllByText(/your funds will remain in your existing mt5 account\(s\)\./i)).toHaveLength(2);
        expect(
            screen.getByText(
                /you can continue trading on your existing mt5 account\(s\) until you close all open positions\./i
            )
        ).toBeInTheDocument();
        expect(
            screen.getAllByText(/new mt5 account\(s\) under the bvi jurisdiction will be created for future trades\./i)
        ).toHaveLength(2);
        expect(screen.getByText(/if you don\’t have open positions/i)).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
        expect(
            screen.getByText(/i agree to move my mt5 account\(s\) and agree to deriv bvi ltd\’s/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/terms and conditions/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });

    it('should render MT5MigrationBackSideContent for Vanuatu migration account', () => {
        response.eligible_account_to_migrate_label = 'vanuatu';
        renderComponent();
        expect(
            screen.getAllByText(
                /new mt5 account\(s\) under the vanuatu jurisdiction will be created for future trades\./i
            )
        ).toHaveLength(2);
        expect(
            screen.getByText(/i agree to move my mt5 account\(s\) and agree to deriv vanuatu ltd\’s/i)
        ).toBeInTheDocument();
    });

    it('should render store functions after clicking on Next button', () => {
        renderComponent();
        const next_button = screen.getByRole('button', { name: 'Next' });
        userEvent.click(next_button);
        expect(mock_store.ui.toggleMT5MigrationModal).toBeCalled();
    });
});
