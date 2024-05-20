import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import { PasskeysList } from '../passkeys-list';
import { mock_passkeys_list } from '../../__tests__/passkeys.spec';

describe('PasskeysList', () => {
    const mock_store = mockStore({
        ui: { is_mobile: true },
        client: { is_passkey_supported: true },
        common: { network_status: { class: 'online' } },
    });

    it('renders the passkeys and calls the correct function when the button is clicked', () => {
        const mockOnPrimaryButtonClick = jest.fn();
        const mockOnSecondaryButtonClick = jest.fn();

        render(
            <StoreProvider store={mock_store}>
                <PasskeysList
                    passkeys_list={mock_passkeys_list}
                    onPrimaryButtonClick={mockOnPrimaryButtonClick}
                    onSecondaryButtonClick={mockOnSecondaryButtonClick}
                />
            </StoreProvider>
        );

        mock_passkeys_list.forEach(passkey => {
            expect(screen.getByText(passkey.name)).toBeInTheDocument();
        });

        userEvent.click(screen.getByRole('button', { name: /create passkey/i }));
        userEvent.click(screen.getByRole('button', { name: /learn more/i }));
        expect(mockOnPrimaryButtonClick).toHaveBeenCalled();
        expect(mockOnSecondaryButtonClick).toHaveBeenCalled();
    });
});
