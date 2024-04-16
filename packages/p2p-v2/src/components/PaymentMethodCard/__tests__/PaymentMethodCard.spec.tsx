import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaymentMethodCard from '../PaymentMethodCard';

const mockProps = {
    isEditable: false,
    medium: false,
    onClickAdd: jest.fn(),
    onDeletePaymentMethod: jest.fn(),
    onEditPaymentMethod: jest.fn(),
    onSelectPaymentMethodCard: jest.fn(),
    paymentMethod: {
        fields: {},
        id: 'test',
        is_enabled: 0,
        method: '',
        type: 'other',
        used_by_adverts: null,
        used_by_orders: null,
    },
    shouldShowPaymentMethodDisplayName: false,
};

describe('PaymentMethodCard', () => {
    it('should render the component correctly', () => {
        render(<PaymentMethodCard {...mockProps} />);
        expect(screen.getByTestId('dt_p2p_v2_payment_method_card_header')).toBeInTheDocument();
    });

    it('should handle the onClickAdd', () => {
        const newProps = {
            ...mockProps,
            paymentMethod: {
                ...mockProps.paymentMethod,
                isAvailable: false,
            },
        };

        render(<PaymentMethodCard {...newProps} />);
        const button = screen.getByRole('button');
        userEvent.click(button);
        expect(mockProps.onClickAdd).toHaveBeenCalled();
    });
    it('should handle the selection of checkbox', () => {
        const newProps = {
            ...mockProps,
            paymentMethod: {
                ...mockProps.paymentMethod,
                isAvailable: true,
            },
        };
        render(<PaymentMethodCard {...newProps} />);
        const checkbox = screen.getByRole('checkbox');
        userEvent.click(checkbox);
        expect(mockProps.onSelectPaymentMethodCard).toHaveBeenCalled();
    });
});
