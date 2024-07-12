import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getOSNameWithUAParser } from '@deriv/shared';
import { PasskeyRemoved } from '../passkey-removed';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getOSNameWithUAParser: jest.fn(() => 'iOS'),
}));

describe('PasskeyRemoved', () => {
    const mockOnPrimaryButtonClick = jest.fn();
    const removed = 'Passkey successfully removed';
    const iOS_description = /remove the passkey from your iCloud keychain/i;
    const android_description = /remove the passkey from your Google password manager/i;
    const success = 'Passkey successfully removed';

    it('renders PasskeyRemoved component on iOS correctly', () => {
        render(<PasskeyRemoved onPrimaryButtonClick={mockOnPrimaryButtonClick} />);

        expect(screen.getByText(success)).toBeInTheDocument();
        expect(screen.getByText(iOS_description)).toBeInTheDocument();
        expect(screen.queryByText(android_description)).not.toBeInTheDocument();
        expect(screen.getByText(removed)).toBeInTheDocument();
        userEvent.click(screen.getByRole('button', { name: /continue/i }));
        expect(mockOnPrimaryButtonClick).toHaveBeenCalled();
    });

    it('renders PasskeyRemoved component on android correctly', () => {
        (getOSNameWithUAParser as jest.Mock).mockReturnValueOnce('Android');

        render(<PasskeyRemoved onPrimaryButtonClick={mockOnPrimaryButtonClick} />);

        expect(screen.getByText(success)).toBeInTheDocument();
        expect(screen.getByText(removed)).toBeInTheDocument();
        expect(screen.queryByText(iOS_description)).not.toBeInTheDocument();
        userEvent.click(screen.getByRole('button', { name: /continue/i }));
        expect(mockOnPrimaryButtonClick).toHaveBeenCalled();
    });
});
