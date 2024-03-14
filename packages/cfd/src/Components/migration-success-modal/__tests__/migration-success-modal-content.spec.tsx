import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { CFDStoreProvider } from '../../../Stores/Modules/CFD/Helpers/useCfdStores';
import MigrationSuccessModalContent from '../migration-success-modal-content';

const mock_store = mockStore({});

const wrapper = ({ children }) => (
    <StoreProvider store={mock_store}>
        <CFDStoreProvider>{children}</CFDStoreProvider>;
    </StoreProvider>
);
describe('<MigrationSuccessModal />', () => {
    const props: React.ComponentProps<typeof MigrationSuccessModalContent> = {
        has_open_positions: false,
        icon: 'icon',
        eligible_account_to_migrate: 'BVI',
        directToCashier: jest.fn(),
    };
    it('component should be rendered', () => {
        render(<MigrationSuccessModalContent {...props} />, { wrapper });

        expect(
            screen.getByRole('heading', {
                name: /success!/i,
            })
        ).toBeInTheDocument();

        expect(screen.getByText(/your new account\(s\) are ready for trading\./i)).toBeInTheDocument();
        expect(
            screen.getByText(/for new trades, please transfer your funds into the new account\(s\)\./i)
        ).toBeInTheDocument();
    });

    it('should not render open position banner if has_open_positions is false', () => {
        render(<MigrationSuccessModalContent {...props} />, { wrapper });

        expect(
            screen.queryByText(/you can continue with the open positions on your current account\(s\)\./i)
        ).not.toBeInTheDocument();

        const button = screen.getByRole('button', {
            name: /transfer now/i,
        });

        userEvent.click(button);
        expect(props.directToCashier).toHaveBeenCalled();
    });

    it('should render open position banner if has_open_positions is true', () => {
        render(<MigrationSuccessModalContent {...props} has_open_positions />, { wrapper });

        expect(
            screen.getByText(/you can continue with the open positions on your current account\(s\)\./i)
        ).toBeInTheDocument();

        const button = screen.getByRole('button', {
            name: /ok/i,
        });

        userEvent.click(button);
        expect(props.directToCashier).toHaveBeenCalled();
    });
});
