import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModal } from '../../../../../components/ModalProvider';
import { MT5PasswordModalFooter, SuccessModalFooter } from '../MT5PasswordModalFooters';

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

describe('SuccessModalFooter', () => {
    it('renders default button for demo account', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        (useModal as jest.Mock).mockReturnValue({ hide: jest.fn() });

        render(<SuccessModalFooter isDemo={true} />);
        expect(screen.getByText('OK')).toBeInTheDocument();
    });

    it('renders default buttons for real account', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        (useModal as jest.Mock).mockReturnValue({ hide: jest.fn() });
        const mockHistory = { push: jest.fn() };
        (useHistory as jest.Mock).mockReturnValue(mockHistory);

        render(<SuccessModalFooter isDemo={false} />);
        expect(screen.getByText('Maybe later')).toBeInTheDocument();
        expect(screen.getByText('Transfer funds')).toBeInTheDocument();
    });

    it('calls hide when OK button is clicked for demo account', () => {
        const mockHide = jest.fn();
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        (useModal as jest.Mock).mockReturnValue({ hide: mockHide });

        render(<SuccessModalFooter isDemo={true} />);
        userEvent.click(screen.getByText('OK'));
        expect(mockHide).toHaveBeenCalled();
    });

    it('navigates to transfer page when transfer funds button is clicked', () => {
        const mockHide = jest.fn();
        const mockHistory = { push: jest.fn() };
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        (useModal as jest.Mock).mockReturnValue({ hide: mockHide });
        (useHistory as jest.Mock).mockReturnValue(mockHistory);

        render(<SuccessModalFooter isDemo={false} />);
        userEvent.click(screen.getByText('Transfer funds'));
        expect(mockHide).toHaveBeenCalled();
        expect(mockHistory.push).toHaveBeenCalledWith('/wallet/account-transfer');
    });
});

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
