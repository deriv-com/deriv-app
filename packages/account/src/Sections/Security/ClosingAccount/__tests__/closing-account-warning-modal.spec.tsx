import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ClosingAccountWarningModal from '../closing-account-warning-modal';

describe('<ClosingAccountWarningModal />', () => {
    const mock_props: React.ComponentProps<typeof ClosingAccountWarningModal> = {
        startDeactivating: jest.fn(),
        closeModal: jest.fn(),
    };
    it('should render the ClosingAccountWarningModal component', () => {
        render(<ClosingAccountWarningModal {...mock_props} />);
        expect(screen.getByText('Close your account?')).toBeInTheDocument();
        expect(screen.getByText(/Closing your account will automatically log you out./i)).toBeInTheDocument();
    });

    it('calls startDeactivating when "Close account" button is clicked', () => {
        render(<ClosingAccountWarningModal {...mock_props} />);

        const closeButton = screen.getByRole('button', { name: /Close account/i });
        userEvent.click(closeButton);

        expect(mock_props.startDeactivating).toHaveBeenCalledTimes(1);
    });

    it('calls closeModal when "Go Back" button is clicked', () => {
        render(<ClosingAccountWarningModal {...mock_props} />);

        const goBackButton = screen.getByRole('button', { name: /Go Back/i });
        userEvent.click(goBackButton);

        expect(mock_props.closeModal).toHaveBeenCalledTimes(1);
    });
});
