import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConnectedAppsRevokeModal } from '../ConnectedAppsRevokeModal';

describe('<ConnectedAppsRevokeModal />', () => {
    const modalRootEl = document.createElement('div');
    modalRootEl.setAttribute('id', 'account_modal');
    document.body.appendChild(modalRootEl);

    const mockProps: React.ComponentProps<typeof ConnectedAppsRevokeModal> = {
        handleRevokeAccess: jest.fn(),
        handleToggleModal: jest.fn(),
        isModalOpen: true,
    };
    it('should render the ConnectedAppsRevokeModal component', () => {
        render(<ConnectedAppsRevokeModal {...mockProps} />);
        expect(screen.getByText(/Confirm revoke access/i)).toBeInTheDocument();
    });

    it('calls handleToggleModal when "Back" button is clicked', () => {
        render(<ConnectedAppsRevokeModal {...mockProps} />);

        const backButton = screen.getByRole('button', { name: /Back/i });
        userEvent.click(backButton);

        expect(mockProps.handleToggleModal).toHaveBeenCalledTimes(1);
    });

    it('calls handleRevokeAccess when "Confirm" button is clicked', () => {
        render(<ConnectedAppsRevokeModal {...mockProps} />);

        const goBackButton = screen.getByRole('button', { name: /Confirm/i });
        userEvent.click(goBackButton);

        expect(mockProps.handleRevokeAccess).toHaveBeenCalledTimes(1);
    });
});
