import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasskeysList from '../passkeys-list';

describe('PasskeysList', () => {
    it('renders the passkeys and calls the correct function when the button is clicked', () => {
        const mockOnPrimaryButtonClick = jest.fn();
        const mockOnSecondaryButtonClick = jest.fn();
        const mock_passkeys_list: React.ComponentProps<typeof PasskeysList>['passkeys_list'] = [
            {
                id: 1,
                name: 'Test Passkey 1',
                last_used_at: 1633024800000,
                created_at: 1633024800000,
                stored_on: 'Device',
                icon: 'IcPasskey',
            },
            {
                id: 2,
                name: 'Test Passkey 2',
                last_used_at: 1633024800000,
                created_at: 1633024800000,
                stored_on: 'Device',
                icon: 'IcPasskey',
            },
        ];

        render(
            <PasskeysList
                passkeys_list={mock_passkeys_list}
                onPrimaryButtonClick={mockOnPrimaryButtonClick}
                onSecondaryButtonClick={mockOnSecondaryButtonClick}
            />
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
