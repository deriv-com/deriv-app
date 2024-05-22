import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorModal from '../ErrorModal';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

const mockProps = {
    isModalOpen: true,
    message: 'error message',
    onRequestClose: jest.fn(),
};

describe('ErrorModal', () => {
    it('should render the component as expected', () => {
        render(<ErrorModal {...mockProps} />);
        expect(screen.getByText("Something's not right")).toBeInTheDocument();
    });
    it('should call onRequestClose when the close button is clicked', () => {
        render(<ErrorModal {...mockProps} />);
        userEvent.click(screen.getByRole('button', { name: 'Ok' }));
        expect(mockProps.onRequestClose).toHaveBeenCalledTimes(1);
    });
});
