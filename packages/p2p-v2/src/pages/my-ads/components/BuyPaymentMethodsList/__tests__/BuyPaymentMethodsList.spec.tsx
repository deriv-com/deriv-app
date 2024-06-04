import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BuyPaymentMethodsList from '../BuyPaymentMethodsList';

const mockProps = {
    list: [
        {
            text: 'Bank Transfer',
            value: 'bank_transfer',
        },
    ],
    onSelectPaymentMethod: jest.fn(),
};

describe('BuyPaymentMethodsList', () => {
    it('should render the buy payment methods list component', () => {
        render(<BuyPaymentMethodsList {...mockProps} />);
        expect(screen.getByPlaceholderText('Add')).toBeInTheDocument();
    });
    it('should call onSelectPaymentMethod when clicking on the payment method', () => {
        render(<BuyPaymentMethodsList {...mockProps} />);
        userEvent.click(screen.getByPlaceholderText('Add'));
        userEvent.click(screen.getByText('Bank Transfer'));
        expect(mockProps.onSelectPaymentMethod).toHaveBeenCalledWith('bank_transfer');
    });
});
