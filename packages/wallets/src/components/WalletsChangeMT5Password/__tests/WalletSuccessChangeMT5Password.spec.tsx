import React, { PropsWithChildren } from 'react';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalProvider } from '../../ModalProvider';
import WalletSuccessChangeMT5Password from '../WalletSuccessChangeMT5Password';
import { APIProvider } from '@deriv/api-v2';
import WalletsAuthProvider from '../../../AuthProvider';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: false })),
}));

describe('<WalletSuccessChangeMT5Password/>', () => {
    const mockOnClick = jest.fn();

    const wrapper = ({ children }: PropsWithChildren) => (
        <APIProvider>
            <WalletsAuthProvider>
                <ModalProvider>{children}</ModalProvider>
            </WalletsAuthProvider>
        </APIProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the success message with correct title and description', () => {
        const { rerender } = render(<WalletSuccessChangeMT5Password onClick={mockOnClick} />, { wrapper });

        expect(screen.getByText('Success')).toBeInTheDocument();
        expect(
            screen.getByText('You can log in to all your Deriv MT5 accounts with your new password.')
        ).toBeInTheDocument();

        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });

        rerender(<WalletSuccessChangeMT5Password onClick={mockOnClick} />);

        expect(screen.getByText('Success')).toBeInTheDocument();
        expect(
            screen.getByText('You can log in to all your Deriv MT5 accounts with your new password.')
        ).toBeInTheDocument();
    });

    it('renders the MT5 success icon', () => {
        render(<WalletSuccessChangeMT5Password onClick={mockOnClick} />, { wrapper });

        expect(screen.getByTestId('dt_mt5_success_icon')).toBeInTheDocument();
    });

    it('calls onClick when Next button is clicked', async () => {
        render(<WalletSuccessChangeMT5Password onClick={mockOnClick} />, { wrapper });

        const nextButton = screen.getByRole('button', { name: 'Next' });
        await userEvent.click(nextButton);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});
