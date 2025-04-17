import { getOSNameWithUAParser } from '@deriv/shared';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PasskeyRemoved } from '../passkey-removed';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getOSNameWithUAParser: jest.fn(() => 'test OS'),
}));

describe('PasskeyRemoved', () => {
    it('renders correctly for iOS', async () => {
        (getOSNameWithUAParser as jest.Mock).mockReturnValue('iOS');

        const mockOnPrimaryButtonClick = jest.fn();

        render(<PasskeyRemoved onPrimaryButtonClick={mockOnPrimaryButtonClick} />);

        expect(screen.getByText('Biometric removed')).toBeInTheDocument();
        expect(
            screen.getByText(
                'This biometric can’t be used anymore. To stop sign-in prompts, delete it from your iCloud Keychain.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('OK')).toBeInTheDocument();

        await userEvent.click(screen.getByText('OK'));
        expect(mockOnPrimaryButtonClick).toHaveBeenCalled();
    });

    it('renders correctly for other OS', async () => {
        (getOSNameWithUAParser as jest.Mock).mockReturnValue('Windows');

        const mockOnPrimaryButtonClick = jest.fn();

        render(<PasskeyRemoved onPrimaryButtonClick={mockOnPrimaryButtonClick} />);

        expect(screen.getByText('Biometric removed')).toBeInTheDocument();
        expect(
            screen.getByText(
                'This biometric can’t be used anymore. To stop sign-in prompts, make sure to delete it from your password manager too.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('OK')).toBeInTheDocument();

        await userEvent.click(screen.getByText('OK'));
        expect(mockOnPrimaryButtonClick).toHaveBeenCalled();
    });
});
