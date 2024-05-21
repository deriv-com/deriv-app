import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasskeyRename } from '../passkey-rename';

describe('PasskeyRename', () => {
    const init_passkey_name = 'init passkey_name';
    const new_passkey_name = 'new passkey name';
    const validation_error = 'Only 3-30 characters allowed.';
    const mockOnPrimaryButtonClick = jest.fn();
    const mockOnSecondaryButtonClick = jest.fn();

    // TODO: extend testcases after renaming flow implementation

    it('renders PasskeyRename form correctly and the name is changed', async () => {
        render(
            <PasskeyRename
                passkey_name={init_passkey_name}
                onPrimaryButtonClick={mockOnPrimaryButtonClick}
                onSecondaryButtonClick={mockOnSecondaryButtonClick}
            />
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
            <PasskeyRename
                passkey_name={init_passkey_name}
                onPrimaryButtonClick={mockOnPrimaryButtonClick}
                onSecondaryButtonClick={mockOnSecondaryButtonClick}
            />
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
