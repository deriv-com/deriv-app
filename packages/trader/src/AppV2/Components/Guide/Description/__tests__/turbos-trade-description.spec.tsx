import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TurbosTradeDescription from '../turbos-trade-description';

describe('TurbosTradeDescription', () => {
    it('should render a proper content', () => {
        render(<TurbosTradeDescription onTermClick={jest.fn()} />);

        expect(screen.getByText(/You may sell the contract up to 15 seconds before expiry/i)).toBeInTheDocument();
    });

    it('should call onTermClick if user clicks on term', () => {
        const onTermClick = jest.fn();
        render(<TurbosTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByText(/final price/i));

        expect(onTermClick).toHaveBeenCalled();
    });
});
