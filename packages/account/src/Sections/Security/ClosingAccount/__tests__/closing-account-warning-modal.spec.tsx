import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ClosingAccountWarningModal from '../closing-account-warning-modal';

describe('<ClosingAccountWarningModal />', () => {
    const modal_root_el = document.createElement('div');
    modal_root_el.setAttribute('id', 'modal_root');
    document.body.appendChild(modal_root_el);

    const mock_props: React.ComponentProps<typeof ClosingAccountWarningModal> = {
        startDeactivating: jest.fn(),
        closeWarningModal: jest.fn(),
        show_warning_modal: true,
    };
    it('should render the ClosingAccountWarningModal component', () => {
        render(<ClosingAccountWarningModal {...mock_props} />);
        expect(screen.getByText(/close your account?/i)).toBeInTheDocument();
        expect(screen.getByText(/closing your account will automatically log you out./i)).toBeInTheDocument();
    });

    it('calls startDeactivating when "Close account" button is clicked', () => {
        render(<ClosingAccountWarningModal {...mock_props} />);

        const closeButton = screen.getByRole('button', { name: /close account/i });
        userEvent.click(closeButton);

        expect(mock_props.startDeactivating).toHaveBeenCalledTimes(1);
    });

    it('calls closeModal when "Go Back" button is clicked', () => {
        render(<ClosingAccountWarningModal {...mock_props} />);

        const goBackButton = screen.getByRole('button', { name: /go back/i });
        userEvent.click(goBackButton);

        expect(mock_props.closeWarningModal).toHaveBeenCalledTimes(1);
    });
});
