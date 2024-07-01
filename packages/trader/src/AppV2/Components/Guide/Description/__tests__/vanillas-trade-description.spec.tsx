import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VanillasTradeDescription from '../vanillas-trade-description';

describe('VanillasTradeDescription', () => {
    it('should render a proper content', () => {
        render(<VanillasTradeDescription onTermClick={jest.fn()} />);

        expect(screen.getByText(/Vanilla options allow you to predict an upward/i)).toBeInTheDocument();
    });

    it('should call onTermClick if user clicks on term', () => {
        const onTermClick = jest.fn();
        render(<VanillasTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getAllByText(/strike price/i)[0]);

        expect(onTermClick).toHaveBeenCalled();
    });
});
