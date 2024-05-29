import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdCreateEditSuccessModal from '../AdCreateEditSuccessModal';

const mockProps = {
    advertsArchivePeriod: 7,
    isModalOpen: true,
    onRequestClose: jest.fn(),
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: jest.fn(),
    }),
}));

describe('AdCreateEditSuccessModal', () => {
    it('should render with passed props', () => {
        render(<AdCreateEditSuccessModal {...mockProps} />);
        expect(screen.getByText(/You’ve created an ad/i)).toBeInTheDocument();
        expect(
            screen.getByText(/If the ad doesn't receive an order for 7 days, it will be deactivated./i)
        ).toBeInTheDocument();
    });
    it('should handle checkbox change', () => {
        render(<AdCreateEditSuccessModal {...mockProps} />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();
        userEvent.click(checkbox);
        expect(checkbox).toBeChecked();
    });
    it('should handle ok button click', () => {
        render(<AdCreateEditSuccessModal {...mockProps} />);
        const okButton = screen.getByRole('button', { name: 'Ok' });
        expect(okButton).toBeInTheDocument();
        userEvent.click(okButton);
        expect(mockProps.onRequestClose).toBeCalledTimes(1);
    });
});
