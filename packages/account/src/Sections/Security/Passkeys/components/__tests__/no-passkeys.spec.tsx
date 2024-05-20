import React from 'react';
import { screen, render } from '@testing-library/react';
import { NoPasskeys } from '../no-passkeys';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';

describe('NoPasskeys', () => {
    const mock_store = mockStore({
        ui: { is_mobile: true },
        client: { is_passkey_supported: true },
        common: { network_status: { class: 'online' } },
    });

    const mockOnPrimaryButtonClick = jest.fn();
    const mockOnSecondaryButtonClick = jest.fn();

    it('renders NoPasskeys component correctly', () => {
        render(
            <StoreProvider store={mock_store}>
                <NoPasskeys
                    onPrimaryButtonClick={mockOnPrimaryButtonClick}
                    onSecondaryButtonClick={mockOnSecondaryButtonClick}
                />
            </StoreProvider>
        );

        expect(screen.getByText('Enhanced security is just a tap away.')).toBeInTheDocument();
        expect(screen.getByText('Experience safer logins')).toBeInTheDocument();
        userEvent.click(screen.getByRole('button', { name: /create passkey/i }));
        userEvent.click(screen.getByRole('button', { name: /learn more/i }));
        expect(mockOnPrimaryButtonClick).toHaveBeenCalled();
        expect(mockOnSecondaryButtonClick).toHaveBeenCalled();
    });
});
