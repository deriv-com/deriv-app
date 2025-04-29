import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { NoPasskeys } from '../no-passkeys';

describe('NoPasskeys', () => {
    const mockOnPrimaryButtonClick = jest.fn();
    const mockOnSecondaryButtonClick = jest.fn();

    it('renders NoPasskeys component correctly', async () => {
        render(
            <NoPasskeys
                onPrimaryButtonClick={mockOnPrimaryButtonClick}
                onSecondaryButtonClick={mockOnSecondaryButtonClick}
            />
        );

        expect(
            screen.getByText(
                'Use fingerprint, face recognition, or other biometric data to log in easily and securely.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Your key to safer logins')).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: /enable biometrics/i }));
        await userEvent.click(screen.getByRole('button', { name: /learn more/i }));
        expect(mockOnPrimaryButtonClick).toHaveBeenCalled();
        expect(mockOnSecondaryButtonClick).toHaveBeenCalled();
    });
});
