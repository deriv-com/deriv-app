import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { PasskeyRemoved } from '../passkey-removed';
import { getOSNameWithUAParser } from '@deriv/shared';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getOSNameWithUAParser: jest.fn(() => 'test OS'),
}));

describe('PasskeyRemoved', () => {
    it('renders correctly for iOS', () => {
        (getOSNameWithUAParser as jest.Mock).mockReturnValue('iOS');

        const mockOnPrimaryButtonClick = jest.fn();

        render(<PasskeyRemoved onPrimaryButtonClick={mockOnPrimaryButtonClick} />);

        expect(screen.getByText('Passkey successfully removed')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Your passkey is successfully removed. To avoid sign-in prompts, also remove the passkey from your iCloud keychain.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Continue')).toBeInTheDocument();

        userEvent.click(screen.getByText('Continue'));
        expect(mockOnPrimaryButtonClick).toHaveBeenCalled();
    });

    it('renders correctly for other OS', () => {
        (getOSNameWithUAParser as jest.Mock).mockReturnValue('Windows');

        const mockOnPrimaryButtonClick = jest.fn();

        render(<PasskeyRemoved onPrimaryButtonClick={mockOnPrimaryButtonClick} />);

        expect(screen.getByText('Passkey successfully removed')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Your passkey is successfully removed. To avoid sign-in prompts, also remove the passkey from your Google password manager.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Continue')).toBeInTheDocument();

        userEvent.click(screen.getByText('Continue'));
        expect(mockOnPrimaryButtonClick).toHaveBeenCalled();
    });
});
