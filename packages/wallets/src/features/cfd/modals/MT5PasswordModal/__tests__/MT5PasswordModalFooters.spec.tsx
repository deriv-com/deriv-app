import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MT5PasswordModalFooter } from '../MT5PasswordModalFooters';

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
}));

jest.mock('../../../../../components/ModalProvider', () => ({
    useModal: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    Button: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
        <button onClick={onClick}>{children}</button>
    ),
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

    it('calls onSecondaryClick when forgot password button is clicked', () => {
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
        userEvent.click(screen.getByText('Forgot password?'));
        expect(mockSecondaryClick).toHaveBeenCalled();
    });

    it('calls onPrimaryClick when add account button is clicked', () => {
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
        userEvent.click(screen.getByText('Add account'));
        expect(mockPrimaryClick).toHaveBeenCalled();
    });
});
