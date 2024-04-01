import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdCreateEditErrorModal from '../AdCreateEditErrorModal';

const mockProps = {
    errorCode: 'AdvertSameLimits',
    isModalOpen: true,
    onRequestClose: jest.fn(),
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));
describe('AdCreateEditErrorModal', () => {
    it('should render the component as expected', () => {
        render(<AdCreateEditErrorModal {...mockProps} />);
        expect(screen.getByText('You already have an ad with this range')).toBeInTheDocument();
    });
    it('should render the error message for duplicate adverts', () => {
        render(<AdCreateEditErrorModal {...mockProps} errorCode='DuplicateAdvert' />);
        expect(screen.getByText('You already have an ad with this rate')).toBeInTheDocument();
    });
    it('should render the general error message if no error code is provided', () => {
        render(<AdCreateEditErrorModal {...mockProps} errorCode={undefined} />);
        expect(screen.getAllByText('Something’s not right')).toHaveLength(2);
    });
    it('should call onRequestClose when the button is clicked', () => {
        render(<AdCreateEditErrorModal {...mockProps} />);
        const button = screen.getByRole('button', { name: 'Update ad' });
        userEvent.click(button);
        expect(mockProps.onRequestClose).toHaveBeenCalledTimes(1);
    });
});
