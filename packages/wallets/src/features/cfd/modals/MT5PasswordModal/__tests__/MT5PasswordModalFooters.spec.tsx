import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MT5PasswordModalFooter } from '../MT5PasswordModalFooters';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(),
}));

describe('MT5PasswordModalFooter', () => {
    it('renders default buttons', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });

        render(
            <MT5PasswordModalFooter
                disabled={false}
                isLoading={false}
                onPrimaryClick={jest.fn()}
                onSecondaryClick={jest.fn()}
            />
        );
        expect(screen.getByText('Forgot password?')).toBeInTheDocument();
        expect(screen.getByText('Add account')).toBeInTheDocument();
    });

    it('calls onSecondaryClick when forgot password button is clicked', async () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        const mockSecondaryClick = jest.fn();

        render(
            <MT5PasswordModalFooter
                disabled={false}
                isLoading={false}
                onPrimaryClick={jest.fn()}
                onSecondaryClick={mockSecondaryClick}
            />
        );
        await userEvent.click(screen.getByText('Forgot password?'));
        expect(mockSecondaryClick).toHaveBeenCalled();
    });

    it('calls onPrimaryClick when add account button is clicked', async () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        const mockPrimaryClick = jest.fn();

        render(
            <MT5PasswordModalFooter
                disabled={false}
                isLoading={false}
                onPrimaryClick={mockPrimaryClick}
                onSecondaryClick={jest.fn()}
            />
        );
        await userEvent.click(screen.getByText('Add account'));
        expect(mockPrimaryClick).toHaveBeenCalled();
    });
});
