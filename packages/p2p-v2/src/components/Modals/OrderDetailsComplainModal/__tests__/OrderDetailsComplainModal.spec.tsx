import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderDetailsComplainModal from '../OrderDetailsComplainModal';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isMobile: false }),
}));

const mockUseDevice = useDevice as jest.Mock;
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
        expect(screen.getByText('What’s your complaint?')).toBeInTheDocument();
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
    it('should render the full page mobile wrapper when in mobile view', () => {
        mockUseDevice.mockReturnValue({ isMobile: true });
        render(<OrderDetailsComplainModal {...mockProps} />);
        expect(screen.getByTestId('dt_p2p_v2_full_page_mobile_wrapper')).toBeInTheDocument();
    });
    it('should render the corresponding labels for sell order', () => {
        mockProps.isBuyOrderForUser = false;
        render(<OrderDetailsComplainModal {...mockProps} />);
        expect(screen.getByRole('radio', { name: 'I’ve not received any payment.' })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: 'I’ve received less than the agreed amount.' })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: 'I’ve received more than the agreed amount.' })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: 'I’ve received payment from 3rd party.' })).toBeInTheDocument();
    });
});
