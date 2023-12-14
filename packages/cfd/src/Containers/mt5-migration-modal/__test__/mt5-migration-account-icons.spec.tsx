import React from 'react';
import MT5MigrationAccountIcons from '../mt5-migration-account-icons';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useMT5SVGEligibleToMigrate: jest.fn(),
}));

const mock_store = mockStore({});

describe('MT5MigrationAccountIcons', () => {
    const renderComponent = () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>{children}</StoreProvider>
        );
        render(<MT5MigrationAccountIcons />, { wrapper });
    };

    it('should render MT5MigrationAccountIcons for derived bvi account', () => {
        renderComponent();
        expect(screen.getByTestId('dt_migrate_from_svg_derived')).toBeInTheDocument();
        expect(screen.getByTestId('dt_migrate_to_bvi_derived')).toBeInTheDocument();
    });

    it('should render MT5MigrationAccountIcons for financial bvi account', () => {
        renderComponent();
        expect(screen.getByTestId('dt_migrate_from_svg_financial')).toBeInTheDocument();
        expect(screen.getByTestId('dt_migrate_to_bvi_financial')).toBeInTheDocument();
    });

    it('should render MT5MigrationAccountIcons for derived vanuatu account', () => {
        renderComponent();
        expect(screen.getByTestId('dt_migrate_from_svg_derived')).toBeInTheDocument();
        expect(screen.getByTestId('dt_migrate_to_vanuatu_derived')).toBeInTheDocument();
    });

    it('should render MT5MigrationAccountIcons for financial vanuatu account', () => {
        renderComponent();
        expect(screen.getByTestId('dt_migrate_from_svg_financial')).toBeInTheDocument();
        expect(screen.getByTestId('dt_migrate_to_vanuatu_financial')).toBeInTheDocument();
    });
});
