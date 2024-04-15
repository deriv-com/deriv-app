import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderDetailsComplainModal from '../OrderDetailsComplainModal';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({
        isMobile: false,
    }),
}));

const mockUseDispute = {
    isSuccess: true,
    mutate: jest.fn(),
};

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    p2p: {
        orderDispute: {
            useDispute: () => mockUseDispute,
        },
    },
}));

const mockProps = {
    id: '123',
    isBuyOrderForUser: true,
    isModalOpen: true,
    onRequestClose: jest.fn(),
};

describe('OrderDetailsComplainModal', () => {
    it('should render the modal as expected', () => {
        render(<OrderDetailsComplainModal {...mockProps} />);
        expect(screen.getByText('What’s your complaint')).toBeInTheDocument();
    });
    it('should close the modal on clicking cancel button', () => {
        render(<OrderDetailsComplainModal {...mockProps} />);
        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        userEvent.click(cancelButton);
        expect(mockProps.onRequestClose).toHaveBeenCalled();
    });
    it('should disable the submit button when no reason is selected', () => {
        render(<OrderDetailsComplainModal {...mockProps} />);
        const submitButton = screen.getByRole('button', { name: 'Submit' });
        expect(submitButton).toBeDisabled();
    });
    it('should enable the submit button when a reason is selected', () => {
        render(<OrderDetailsComplainModal {...mockProps} />);
        const submitButton = screen.getByRole('button', { name: 'Submit' });
        const reason = screen.getByRole('radio', { name: 'I wasn’t able to make full payment.' });
        userEvent.click(reason);
        expect(submitButton).toBeEnabled();
    });
    it('should call mutate function on clicking submit button', () => {
        render(<OrderDetailsComplainModal {...mockProps} />);
        const submitButton = screen.getByRole('button', { name: 'Submit' });
        const reason = screen.getByRole('radio', { name: 'I wasn’t able to make full payment.' });
        userEvent.click(reason);
        userEvent.click(submitButton);
        expect(mockUseDispute.mutate).toHaveBeenCalledWith({ dispute_reason: 'buyer_underpaid', id: '123' });
        expect(mockProps.onRequestClose).toHaveBeenCalled();
    });
});
