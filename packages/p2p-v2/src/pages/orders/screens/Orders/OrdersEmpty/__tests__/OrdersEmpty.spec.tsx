import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrdersEmpty from '../OrdersEmpty';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

const mockFn = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockFn,
    }),
}));

describe('OrdersEmpty', () => {
    it('should render OrdersEmpty', () => {
        render(<OrdersEmpty />);
        expect(screen.getByText('You have no orders.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Buy/Sell' })).toBeInTheDocument();
    });
    it('should handle clicking on buy/sell button', () => {
        render(<OrdersEmpty />);
        const button = screen.getByRole('button', { name: 'Buy/Sell' });
        userEvent.click(button);
        expect(mockFn).toHaveBeenCalledWith('/cashier/p2p-v2/buy-sell');
    });
});
