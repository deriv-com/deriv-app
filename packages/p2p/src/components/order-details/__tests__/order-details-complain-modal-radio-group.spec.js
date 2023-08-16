import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import OrderDetailsComplainModalRadioGroup from '../order-details-complain-modal-radio-group.jsx';

describe('<OrderDetailsComplainModalRadioGroup/>', () => {
    it('should render component with 4 radio buttons for sell order', () => {
        render(<OrderDetailsComplainModalRadioGroup />);

        expect(screen.getAllByRole('radio')).toHaveLength(4);
    });

    it('should call handler function when checkbox is selected', () => {
        const mockFn = jest.fn();
        render(<OrderDetailsComplainModalRadioGroup onCheckboxChange={mockFn} />);
        fireEvent.click(screen.getAllByRole('radio')[1]);

        expect(mockFn).toHaveBeenCalledWith('buyer_underpaid');
    });

    it('should render all of the 4 options for sell order', () => {
        render(<OrderDetailsComplainModalRadioGroup />);

        expect(screen.getByLabelText('I’ve not received any payment.')).toBeInTheDocument();
        expect(screen.getByLabelText('I’ve received less than the agreed amount.')).toBeInTheDocument();
        expect(screen.getByLabelText('I’ve received more than the agreed amount.')).toBeInTheDocument();
        expect(screen.getByText('I’ve received payment from 3rd party.')).toBeInTheDocument();
    });

    it('should render all of the 3 options for buy order', () => {
        render(<OrderDetailsComplainModalRadioGroup is_buy_order_for_user />);

        expect(
            screen.getByLabelText('I’ve made full payment, but the seller hasn’t released the funds.')
        ).toBeInTheDocument();
        expect(screen.getByLabelText('I wasn’t able to make full payment.')).toBeInTheDocument();
        expect(screen.getByLabelText('I’ve paid more than the agreed amount.')).toBeInTheDocument();
    });
    it('should call handler function with buyer_third_party_payment_method when i have received payment is selected for sell order', () => {
        const mockFn = jest.fn();
        render(<OrderDetailsComplainModalRadioGroup onCheckboxChange={mockFn} />);
        fireEvent.click(screen.getAllByRole('radio')[3]);

        expect(mockFn).toHaveBeenCalledWith('buyer_third_party_payment_method');
    });
});
