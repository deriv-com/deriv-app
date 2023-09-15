import React from 'react';
import { render, screen } from '@testing-library/react';
import MultiplierTradeDescription from '../multiplier-trade-description';

describe('<MultiplierTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<MultiplierTradeDescription />);

        expect(screen.getByText(/Predict the market direction and select either “Up” or “Down”/i)).toBeInTheDocument();
    });
});
