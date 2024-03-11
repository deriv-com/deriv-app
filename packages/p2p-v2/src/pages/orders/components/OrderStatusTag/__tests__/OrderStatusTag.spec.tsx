import React from 'react';
import { render, screen } from '@testing-library/react';
import OrderStatusTag from '../OrderStatusTag';

const mockProps = {
    shouldHighlightAlert: false,
    shouldHighlightDanger: false,
    shouldHighlightDisabled: false,
    shouldHighlightSuccess: false,
    status: 'Pay now',
};

describe('OrderStatusTag', () => {
    it('should render OrderStatusTag with the provides status', () => {
        render(<OrderStatusTag {...mockProps} />);
        expect(screen.getByText('Pay now')).toBeInTheDocument();
    });
});
