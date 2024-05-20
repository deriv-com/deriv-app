import React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import { PasskeyRename } from '../passkey-rename';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';

describe('PasskeyRename', () => {
    const mock_store = mockStore({
        ui: { is_mobile: true },
        client: { is_passkey_supported: true },
        common: { network_status: { class: 'online' } },
    });

    const init_passkey_name = 'init passkey_name';
    const new_passkey_name = 'new passkey name';
    const validation_error = 'Only 3-30 characters allowed.';
    const mockOnPrimaryButtonClick = jest.fn();
    const mockOnSecondaryButtonClick = jest.fn();

    // TODO: extend testcases after renaming flow implementation

    it('renders PasskeyRename form correctly and the name is changed', async () => {
        render(
            <StoreProvider store={mock_store}>
                <PasskeyRename
                    passkey_name={init_passkey_name}
                    onPrimaryButtonClick={mockOnPrimaryButtonClick}
                    onSecondaryButtonClick={mockOnSecondaryButtonClick}
                />
            </StoreProvider>
        );

        expect(screen.getByText('Edit passkey')).toBeInTheDocument();
        const input = screen.getByRole('textbox');
        expect(input).not.toHaveValue(new_passkey_name);
        expect(input).toHaveValue(init_passkey_name);
        expect(input).toBeInTheDocument();

        userEvent.clear(input);
        userEvent.type(input, new_passkey_name);

        expect(input).toHaveValue(new_passkey_name);
        expect(input).not.toHaveValue(init_passkey_name);

        userEvent.click(screen.getByRole('button', { name: /save changes/i }));
        userEvent.click(screen.getByRole('button', { name: /back/i }));

        expect(mockOnPrimaryButtonClick).toHaveBeenCalled();
        expect(mockOnSecondaryButtonClick).toHaveBeenCalled();
    });

    it('renders PasskeyRename form correctly and check the validation for name', async () => {
        render(
            <StoreProvider store={mock_store}>
                <PasskeyRename
                    passkey_name={init_passkey_name}
                    onPrimaryButtonClick={mockOnPrimaryButtonClick}
                    onSecondaryButtonClick={mockOnSecondaryButtonClick}
                />
            </StoreProvider>
        );

        expect(screen.getByText('Edit passkey')).toBeInTheDocument();
        const input = screen.getByRole('textbox');
        const save_changes_button = screen.getByRole('button', { name: /save changes/i });

        expect(save_changes_button).toBeDisabled();

        userEvent.clear(input);
        userEvent.type(input, 'n');

        await waitFor(() => {
            expect(save_changes_button).toBeDisabled();
            expect(screen.getByText(validation_error)).toBeInTheDocument();
        });

        userEvent.type(input, 'new name');

        await waitFor(() => {
            expect(save_changes_button).toBeEnabled();
            expect(screen.queryByText(validation_error)).not.toBeInTheDocument();
        });

        userEvent.clear(input);
        userEvent.type(input, 'new long name to test validation');

        await waitFor(() => {
            expect(save_changes_button).toBeDisabled();
            expect(screen.queryByText(validation_error)).toBeInTheDocument();
        });
    });
});
