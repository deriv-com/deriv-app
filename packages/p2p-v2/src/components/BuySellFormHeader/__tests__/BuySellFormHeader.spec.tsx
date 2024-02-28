import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BuySellFormHeader from '../BuySellFormHeader';

const mockProps = {
    currency: 'USD',
    type: 'buy',
};
const mockOnClickBack = jest.fn();
describe('BuySellFormHeader', () => {
    it('should render the header as expected', () => {
        render(<BuySellFormHeader {...mockProps} />);
        expect(screen.getByText('Sell USD')).toBeInTheDocument();
    });
    it('should render the backicon when onClickback is provided for mobile view', () => {
        render(<BuySellFormHeader {...mockProps} onClickBack={mockOnClickBack} />);
        const backIcon = screen.getByTestId('dt_p2p_v2_buy_sell_form_header_back');
        expect(backIcon).toBeInTheDocument();
        userEvent.click(backIcon);
        expect(mockOnClickBack).toHaveBeenCalled();
    });
});
