import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PageReturn from '../PageReturn';

const mockOnClick = jest.fn();
describe('PageReturn', () => {
    it('should render the title and behaviour of return correctly', () => {
        render(<PageReturn onClick={mockOnClick} pageTitle='Cashier P2P' />);

        expect(screen.getByText('Cashier P2P')).toBeVisible();
        const returnBtn = screen.getByTestId('dt_p2p_v2_page_return_btn');
        userEvent.click(returnBtn);
        expect(mockOnClick).toBeCalled();
    });
});
