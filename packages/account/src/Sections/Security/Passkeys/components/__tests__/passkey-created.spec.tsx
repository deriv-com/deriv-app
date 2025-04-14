import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PasskeyCreated } from '../passkey-created';

describe('PasskeyCreated', () => {
    const mockOnPrimaryButtonClick = jest.fn();
    const mockOnSecondaryButtonClick = jest.fn();

    it('renders PasskeyCreated component correctly', async () => {
        render(
            <PasskeyCreated
                onPrimaryButtonClick={mockOnPrimaryButtonClick}
                onSecondaryButtonClick={mockOnSecondaryButtonClick}
            />
        );

        expect(screen.getByText('Success')).toBeInTheDocument();
        expect(screen.getByText(/Your Deriv account is now protected with biometrics/)).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: /Go to Trader's Hub/i }));
        await userEvent.click(screen.getByRole('button', { name: /Manage biometrics/i }));
        expect(mockOnPrimaryButtonClick).toHaveBeenCalled();
        expect(mockOnSecondaryButtonClick).toHaveBeenCalled();
    });
});
