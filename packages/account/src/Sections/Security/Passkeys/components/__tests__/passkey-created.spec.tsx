import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import { PasskeyCreated } from '../passkey-created';

describe('PasskeyCreated', () => {
    const mock_store = mockStore({
        ui: { is_mobile: true },
        client: { is_passkey_supported: true },
        common: { network_status: { class: 'online' } },
    });

    const mockOnPrimaryButtonClick = jest.fn();
    const mockOnSecondaryButtonClick = jest.fn();

    it('renders PasskeyCreated component correctly', () => {
        render(
            <StoreProvider store={mock_store}>
                <PasskeyCreated
                    onPrimaryButtonClick={mockOnPrimaryButtonClick}
                    onSecondaryButtonClick={mockOnSecondaryButtonClick}
                />
            </StoreProvider>
        );

        expect(screen.getByText('Success!')).toBeInTheDocument();
        expect(screen.getByText(/Your account is now secured with a passkey/)).toBeInTheDocument();
        expect(screen.getByText(/Manage your passkey/)).toBeInTheDocument();
        userEvent.click(screen.getByRole('button', { name: /continue trading/i }));
        userEvent.click(screen.getByRole('button', { name: /add more passkeys/i }));
        expect(mockOnPrimaryButtonClick).toHaveBeenCalled();
        expect(mockOnSecondaryButtonClick).toHaveBeenCalled();
    });
});
